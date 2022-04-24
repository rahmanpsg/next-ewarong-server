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
        data: json,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async verifyToken(req: Request, res: Response) {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res
        .status(404)
        .send({ error: true, message: "Token diperlukan untuk otentikasi" });
    }

    try {
      const decoded = jsonwebtoken.verify(token, process.env.TOKEN_KEY!);

      const user = await userModel.findById(
        (decoded as jsonwebtoken.JwtPayload).id
      );

      res.status(200).send({
        error: false,
        message: "Token valid",
        data: user,
      });
    } catch (err) {
      return res
        .status(401)
        .send({ error: true, message: "Token Tidak Valid" });
    }
  }
}

export default new AuthController();
