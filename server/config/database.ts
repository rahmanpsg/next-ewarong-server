import mongoose from "mongoose";

const MONGO_URI: string =
	process.env.NODE_ENV == "development"
		? process.env.MONGO_URI!
		: process.env.MONGO_URI!;

exports.connect = async () => {
	// Connecting to the database
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Berhasil terhubung ke database");
	} catch (error) {
		console.log("Gagal terhubung ke database...");
		console.error(error);
		process.exit(1);
	}
};
