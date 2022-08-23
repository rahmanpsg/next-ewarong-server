import { Request, Response } from "express";
import { Model, Error } from "mongoose";
import { IUser } from "../models/user";
import jsonwebtoken from "jsonwebtoken";
import { getSession, sendMessage, formatPhone } from "../whatsapp";
import { generateKodeAgen } from "../utils/kode_agen";

const userModel: Model<IUser> = require("../models/user");

class AuthController {
	async login(req: Request, res: Response) {
		try {
			const { kpm, kode, password } = req.body;

			const find = { kpm, kode, password };

			const user = await userModel.findOne(find);

			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "User tidak ditemukan" });
			}

			// cek user aktif
			if (!user.aktif) {
				return res.status(404).send({
					error: true,
					message: "Akun anda belum diaktifkan oleh admin",
				});
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

	async loginAdmin(req: Request, res: Response) {
		try {
			const { username, password } = req.body;

			const user = await userModel.findOne({ username, password });

			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "User tidak ditemukan" });
			}

			// cek role admin
			if (user.role != "admin") {
				return res.status(404).send({
					error: true,
					message: "Akun anda tidak memiliki akses admin",
				});
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

	async loginQRCode(req: Request, res: Response) {
		try {
			const { id, role } = req.body;

			const user = await userModel.findOne({ id, role });

			if (!user) {
				return res
					.status(404)
					.send({ error: true, message: "User tidak ditemukan" });
			}

			// cek user aktif
			if (!user.aktif) {
				return res.status(404).send({
					error: true,
					message: "Akun anda belum diaktifkan oleh admin",
				});
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

	async registrasi(req: Request, res: Response) {
		try {
			const { nama, namaToko, alamat, telpon, password, role } = req.body;

			const kode = generateKodeAgen();

			const user = await userModel.create({
				nama,
				namaToko,
				alamat,
				telpon,
				kode,
				password,
				role,
			});

			res.status(200).send({
				error: false,
				message: "Registrasi berhasil",
				data: user,
			});
		} catch (error: any) {
			if ((error as Error.ValidationError).name === "ValidationError") {
				let errors: any = {};

				Object.keys(error.errors).forEach((key) => {
					errors[key] = error.errors[key].message;
				});

				return res
					.status(400)
					.send({ error: true, message: "Registrasi Gagal", errors });
			}

			res.status(500).send({
				error: true,
				message: "Terjadi masalah di server",
				data: error,
			});
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

	async lupaPassword(req: Request, res: Response) {
		try {
			// periksa apakah whatsapp terhubung
			const session = getSession();

			if (!session) {
				return res.status(404).send({
					error: true,
					message:
						"Layanan tidak tersedia saat ini, silahkan coba beberapa saat lagi",
				});
			}

			const { kpm, telpon } = req.body;

			// check kpm
			const user = await userModel.findOne({ kpm });

			if (!user) {
				return res.status(404).send({
					error: true,
					message: "KPM tidak ditemukan",
				});
			}

			// check telpon
			if (user.telpon != telpon) {
				return res.status(404).send({
					error: true,
					message: "Nomor Telpon tidak sesuai dengan KPM yang terdaftar",
				});
			}

			// generate password baru 5 karakter
			const password = Math.random().toString(36).substring(2, 7);

			// update password
			await userModel.updateOne({ kpm }, { password });

			// send whatsapp
			const message = `Halo ${user.nama},\n\nPassword baru anda adalah ${password} \n\nTerima kasih.`;

			await sendMessage(session, formatPhone(user.telpon), message);

			res.status(200).send({
				error: false,
				message:
					"Password baru telah dikirim ke nomor anda, silahkan cek whatsapp",
			});
		} catch (error) {
			console.log(error);

			res.status(500).send({
				error: true,
				message: "Terjadi masalah di server",
				data: error,
			});
		}
	}
}

export default new AuthController();
