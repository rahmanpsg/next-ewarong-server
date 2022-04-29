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
      .populate("masyarakat", "ktm nama")
      .populate("sembako", "nama harga fotoUrl");

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
      .populate("masyarakat", "ktm nama")
      .populate("sembako", "nama harga fotoUrl");

    res.send({
      error: false,
      data: pesanans,
    });
  }

  async post(req: Request, res: Response) {
    try {
      const { masyarakat, agen, sembako, jumlah } = req.body;

      // validasi stok dan harga
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

      pesanan.save((err, doc) => {
        if (err) return res.status(500).send({ error: true, message: err });

        console.log(doc);

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
}

export default new PesananController();
