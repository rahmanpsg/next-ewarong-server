import { Request, Response } from "express";
import { Model } from "mongoose";
import { IUser } from "../models/user";
import { IPesanan } from "../models/pesanan";

const userModel: Model<IUser> = require("../models/user");
const pesananModel: Model<IPesanan> = require("../models/pesanan");

class TotalController {
  async get(_: Request, res: Response) {
    const agen = await userModel.countDocuments({ role: "agen" });

    const user = await userModel.countDocuments({ role: "user" });

    const transaksi = await pesananModel.countDocuments({ selesai: true });

    res.send({ error: false, total: { agen, user, transaksi } });
  }
}

export default new TotalController();
