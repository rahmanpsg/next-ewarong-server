import { Request, Response } from "express";
import { Model } from "mongoose";
import { IUser } from "../models/user";
import jsonwebtoken from "jsonwebtoken";

const userModel: Model<IUser> = require("../models/user");

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { ktm, username, password } = req.body;

      const find = { ktm, username, password };

      const user = await userModel.findOne(find);

      if (!user) {
        return res
          .status(404)
          .send({ error: true, message: "User tidak ditemukan" });
      }

      // Create token
      const token = jsonwebtoken.sign(
        { id: user._id },
        process.env.TOKEN_KEY!,
        {
          expiresIn: "7 days",
        }
      );

      const json: any = user.toJSON();

      json.id = user._id;
      json.token = token;

      res.status(200).send({
        error: false,
        message: "Anda berhasil login",
        user: json,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async logout(req: Request, res: Response) {
    const { jwt } = req.cookies;

    if (!jwt) {
      return res.status(404).send({ error: true, message: "Anda belum login" });
    }

    res.clearCookie("jwt");

    res.status(200).send({
      error: false,
      message: "Anda berhasil logout",
    });
  }

  async verifyToken(req: Request, res: Response) {
    const { jwt } = req.cookies;

    if (!jwt) {
      return res
        .status(404)
        .send({ error: true, message: "Token tidak valid" });
    }

    res.status(200).send({
      error: false,
      message: "Token valid",
    });
  }
}

export default new AuthController();
