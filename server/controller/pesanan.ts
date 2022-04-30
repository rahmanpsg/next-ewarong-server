import { Request, Response } from "express";
import { Model } from "mongoose";
import { IPesanan } from "server/models/pesanan";
import { ISembako } from "server/models/sembako";
import { IUser } from "../models/user";

const pesananModel: Model<IPesanan> = require("../models/pesanan");
const sembakoModel: Model<ISembako> = require("../models/sembako");
const userModel: Model<IUser> = require("../models/user");

class PesananController {
  async get(req: Request, res: Response) {
    try {
      const pesanan = await pesananModel.findById(req.params.id);
      if (!pesanan) {
        return res
          .status(404)
          .send({ error: true, message: "Data pesanan tidak ditemukan" });
      }
      res.status(200).send({ error: false, data: pesanan });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllPesananAgen(req: Request, res: Response) {
    const agen = req.params.id;

    const pesanans = await pesananModel
      .find({
        agen,
      })
      .populate("masyarakat", "fotoUrl ktm nama saldo")
      .populate("sembako", "nama harga fotoUrl")
      .sort({ updatedAt: -1 });

    res.send({
      error: false,
      data: pesanans,
    });
  }

  async getAllPesananMasyarakat(req: Request, res: Response) {
    const masyarakat = req.params.id;

    const pesanans = await pesananModel
      .find({
        masyarakat,
      })
      .populate("agen", "fotoUrl nama alamat")
      .populate("sembako", "nama harga fotoUrl")
      .sort({ updatedAt: -1 });

    res.send({
      error: false,
      data: pesanans,
    });
  }

  async post(req: Request, res: Response) {
    try {
      const { masyarakat, agen, sembako, jumlah } = req.body;

      // validasi stok
      const sembakoData = await sembakoModel.findById(sembako);

      if (sembakoData?.stok! < jumlah) {
        return res
          .status(400)
          .send({ error: true, message: "Stok tidak cukup" });
      }

      // validasi saldo
      const masyarakatData = await userModel.findById(masyarakat);

      if (masyarakatData?.saldo! < sembakoData?.harga! * jumlah) {
        return res
          .status(400)
          .send({ error: true, message: "Saldo tidak cukup" });
      }

      const harga = sembakoData?.harga;

      const pesanan = await pesananModel.create({
        masyarakat,
        agen,
        sembako,
        harga,
        jumlah,
      });

      await pesanan.populate("agen", "fotoUrl nama alamat");
      await pesanan.populate("sembako", "nama harga fotoUrl");

      pesanan.save((err, doc) => {
        if (err) return res.status(500).send({ error: true, message: err });

        res.status(200).send({
          error: false,
          message: "Data pesanan berhasil disimpan",
          data: doc,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: true,
        message: "Data gagal ditambahkan",
      });
    }
  }

  async konfirmasi(req: Request, res: Response) {
    try {
      const pesanan = await pesananModel.findById(req.params.id);
      if (!pesanan) {
        return res
          .status(404)
          .send({ error: true, message: "Data pesanan tidak ditemukan" });
      }

      // validasi stok
      const sembakoData = await sembakoModel.findById(pesanan.sembako);

      if (sembakoData?.stok! < pesanan.jumlah) {
        return res
          .status(400)
          .send({ error: true, message: "Stok tidak cukup" });
      }

      // validasi saldo
      const masyarakatData = await userModel.findById(pesanan.masyarakat);

      if (masyarakatData?.saldo! < sembakoData?.harga! * pesanan.jumlah) {
        return res
          .status(400)
          .send({ error: true, message: "Saldo tidak cukup" });
      }

      const { status, selesai } = req.body;

      const update = JSON.parse(
        JSON.stringify({
          status,
          selesai,
        })
      );

      pesanan.set(update);

      await pesanan.save();

      setTimeout(() => {
        if (selesai) {
          // update stok
          sembakoData!.stok -= pesanan.jumlah;
          sembakoData!.save();

          // update saldo masyarakat
          const saldo =
            masyarakatData!.saldo - sembakoData?.harga! * pesanan.jumlah;
          const updateMasyarakat = JSON.parse(
            JSON.stringify({
              saldo,
            })
          );

          masyarakatData!.set(updateMasyarakat);

          masyarakatData!.save();
        }

        res.status(200).send({
          error: false,
          message: "Data pesanan berhasil diupdate",
          data: pesanan,
        });
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new PesananController();
