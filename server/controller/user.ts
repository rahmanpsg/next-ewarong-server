import { Request, Response } from "express";
import { Model } from "mongoose";
import { IUser } from "../models/user";

const userModel: Model<IUser> = require("../models/user");

class UserController {
  async get(req: Request, res: Response) {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .send({ error: true, message: "User tidak ditemukan" });
      }
      res.status(200).send({ error: false, data: user });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllByRole(req: Request, res: Response) {
    const role = req.params.role;

    const users = await userModel.find({
      role,
    });

    res.send({
      error: false,
      data: users,
    });
  }

  async put(req: Request, res: Response) {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .send({ error: true, message: "User tidak ditemukan" });
      }
      const { ktm, username, password, foto } = req.body;

      const update = JSON.parse(
        JSON.stringify({
          ktm,
          username,
          password,
          foto,
        })
      );

      user.set(update);

      await user.save();

      res.status(200).send({
        error: false,
        message: "User berhasil diupdate",
        data: user,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserController();
