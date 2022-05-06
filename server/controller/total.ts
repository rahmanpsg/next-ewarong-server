import { Request, Response } from "express";
import { Model } from "mongoose";
import { IUser } from "../models/user";
const userModel: Model<IUser> = require("../models/user");

class TotalController {
  async get(_: Request, res: Response) {
    const agen = await userModel.countDocuments({ role: "agen" });

    const user = await userModel.countDocuments({ role: "user" });

    res.send({ error: false, total: { agen, user } });
  }
}

export default new TotalController();
