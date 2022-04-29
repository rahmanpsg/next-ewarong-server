import { Request, Response } from "express";
import { Model } from "mongoose";
import { ISembako } from "../models/sembako";
import cloudinary from "cloudinary";
import { UploadedFile } from "express-fileupload";

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

  async getAll(_: Request, res: Response) {
    const sembakos = await sembakoModel.find();

    res.send({
      error: false,
      data: sembakos,
    });
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

      const { nama, harga, stok } = req.body;

      let fotoUrl;

      if (req.files!.file) {
        const file: UploadedFile = req.files?.file as UploadedFile;
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
          public_id: "sembako/" + file.name,
        });

        fotoUrl = result.secure_url;
      }

      const sembako = await sembakoModel.create({
        agen,
        nama,
        harga,
        stok,
        fotoUrl,
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
      const { nama, harga, stok } = req.body;

      let fotoUrl;

      if (req.files?.file) {
        const file: UploadedFile = req.files?.file as UploadedFile;
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
          public_id: "sembako/" + file.name,
        });

        fotoUrl = result.url;
      }

      const update = JSON.parse(
        JSON.stringify({
          nama,
          harga,
          stok,
          fotoUrl,
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
