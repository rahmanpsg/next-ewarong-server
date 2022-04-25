import { Request, Response } from "express";
import { Model } from "mongoose";
import { ISembako } from "../models/sembako";

const sembakoModel: Model<ISembako> = require("../models/sembako");

class SembakoController {
  async get(req: Request, res: Response) {
    try {
      const sembako = await sembakoModel.findById(req.params.id);
      if (!sembako) {
        return res
          .status(404)
          .send({ error: true, message: "Data sembako tidak ditemukan" });
      }
      res.status(200).send({ error: false, data: sembako });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllSembakoAgen(req: Request, res: Response) {
    const agen = req.params.idAgen;

    const sembakos = await sembakoModel.find({
      agen,
    });

    res.send({
      error: false,
      data: sembakos,
    });
  }

  async post(req: Request, res: Response) {
    try {
      const agen = req.params.idAgen;

      const { nama, foto, harga, stok } = req.body;

      const sembako = await sembakoModel.create({
        agen,
        nama,
        foto,
        harga,
        stok,
      });

      sembako.save((err, doc) => {
        if (err) return res.status(500).send({ error: true, message: err });

        res.status(200).send({
          error: false,
          message: "Data sembako berhasil disimpan",
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

  async put(req: Request, res: Response) {
    try {
      const sembako = await sembakoModel.findById(req.params.id);
      if (!sembako) {
        return res
          .status(404)
          .send({ error: true, message: "Data sembako tidak ditemukan" });
      }
      const { nama, foto, harga, stok } = req.body;

      const update = JSON.parse(
        JSON.stringify({
          nama,
          foto,
          harga,
          stok,
        })
      );

      sembako.set(update);

      await sembako.save();

      res.status(200).send({
        error: false,
        message: "Data sembako berhasil diupdate",
        data: sembako,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new SembakoController();
