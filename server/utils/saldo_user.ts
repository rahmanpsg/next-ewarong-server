import { Model } from "mongoose";
import { IUser } from "../models/user";
const userModel: Model<IUser> = require("../models/user");

export const callculateSaldoUser = async () => {
	//   get all user
	const users = await userModel.find({ role: "user" });

	for (const user of users) {
		// check if user is created this month
		const thisMonth = new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			1
		);

		if (thisMonth.valueOf() <= user.createdAt.valueOf()) continue;

		if (
			user.lastSaldoUpdated === undefined ||
			thisMonth.valueOf() > user.lastSaldoUpdated.valueOf()
		) {
			// calculate saldo
			const saldo = user.saldo + 200000;
			user.saldo = saldo;
			user.lastSaldoUpdated = new Date();
			await user.save();

			console.log(`saldo user ${user.nama} updated`);
		}
	}
};
