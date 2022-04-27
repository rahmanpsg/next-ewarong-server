import { Request, Response } from "express";
import { Model } from "mongoose";
import { IPesanan } from "server/models/pesanan";

const pesananModel: Model<IPesanan> = require("../models/pesanan");

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
    const agen = req.params.idAgen;

    const pesanans = await pesananModel.find({
      agen,
    });

    res.send({
      error: false,
      data: pesanans,
    });
  }
}

export default new PesananController();
