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
      .populate("user", "fotoUrl ktm nama saldo")
      .populate("sembako", "nama harga fotoUrl")
      .sort({ updatedAt: -1 });

    res.send({
      error: false,
      data: pesanans,
    });
  }

  async getAllPesananUser(req: Request, res: Response) {
    const user = req.params.id;

    const pesanans = await pesananModel
      .find({
        user,
      })
      .populate("agen", "fotoUrl nama alamat")
      .populate("sembako", "nama harga fotoUrl")
      .sort({ updatedAt: -1 });

    res.send({
      error: false,
      data: pesanans,
    });
  }

  async getAllTransaksiAgen(req: Request, res: Response) {
    const agen = req.params.id;

    const { tahun, bulan } = req.query;

    const pesanans = await pesananModel
      .find({
        agen,
        selesai: true,
        updatedAt: {
          $gte: new Date(`${tahun}-${bulan}-01`),
          $lt: new Date(`${tahun}-${bulan}-31`),
        },
      })
      .populate("user", "nama")
      .populate("sembako", "nama")
      .sort({ updatedAt: -1 });

    // hitung total pendapatan
    let pendapatan = 0;
    for (const pesanan of pesanans) {
      pendapatan += pesanan.harga * pesanan.jumlah;
    }

    res.send({
      error: false,
      data: { transaksi: pesanans, pendapatan },
    });
  }

  async getAllTransaksiUser(req: Request, res: Response) {
    const user = req.params.id;

    const pesanans = await pesananModel
      .find({
        user,
        selesai: true,
      })
      .populate("agen", "nama")
      .populate("sembako", "nama")
      .sort({ updatedAt: -1 });

    res.send({
      error: false,
      data: pesanans,
    });
  }

  async post(req: Request, res: Response) {
    try {
      const { user, agen, sembako, jumlah } = req.body;

      // validasi stok
      const sembakoData = await sembakoModel.findById(sembako);

      if (sembakoData?.stok! < jumlah) {
        return res
          .status(400)
          .send({ error: true, message: "Stok tidak cukup" });
      }

      // validasi saldo
      const userData = await userModel.findById(user);

      if (userData?.saldo! < sembakoData?.harga! * jumlah) {
        return res
          .status(400)
          .send({ error: true, message: "Saldo tidak cukup" });
      }

      const harga = sembakoData?.harga;

      const pesanan = await pesananModel.create({
        user,
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

      const { status, selesai } = req.body;

      const sembakoData = await sembakoModel.findById(pesanan.sembako);

      const userData = await userModel.findById(pesanan.user);

      if (status == true) {
        // validasi stok
        if (sembakoData?.stok! < pesanan.jumlah) {
          return res
            .status(400)
            .send({ error: true, message: "Stok tidak cukup" });
        }

        // validasi saldo
        if (userData?.saldo! < pesanan.harga * pesanan.jumlah) {
          return res
            .status(400)
            .send({ error: true, message: "Saldo tidak cukup" });
        }
      }

      pesanan.set({ status, selesai });

      await pesanan.save();

      if (selesai) {
        // update stok
        sembakoData!.stok -= pesanan.jumlah;
        sembakoData!.save();

        // update saldo user
        const saldo = userData!.saldo - sembakoData?.harga! * pesanan.jumlah;

        userData!.set({
          saldo,
        });

        userData!.save();
      }

      res.status(200).send({
        error: false,
        message: "Data pesanan berhasil diupdate",
        data: pesanan,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new PesananController();
