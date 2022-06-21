import { Request, Response } from "express";
import { Model } from "mongoose";
import { IUser } from "../models/user";

const userModel: Model<IUser> = require("../models/user");

class TokoController {
	async getAll(_: Request, res: Response) {
		const tokos = await userModel
			.find({
				role: "agen",
			})
			.select("namaToko alamat");

		res.send({
			error: false,
			data: tokos,
		});
	}
}

export default new TokoController();
