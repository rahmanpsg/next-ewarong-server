import { Request, Response } from "express";
import { Model } from "mongoose";
import { validationError } from "../utils/validation_error";
import { IUser } from "../models/user";
import ApiResponse from "../models/api_response";
import QRCode from "qrcode";
import { PassThrough } from "stream";

const userModel: Model<IUser> = require("../models/user");

class UserController {
	async get(req: Request, res: Response) {
		try {
			const user = await userModel.findById(req.params.id);
			if (!user) {
				return res.status(404).send(
					new ApiResponse({
						error: true,
						message: "User tidak ditemukan",
					})
				);
			}

			res.status(200).send(
				new ApiResponse({
					error: false,
					data: user,
				})
			);
		} catch (error) {
			res.status(400).send(validationError(error));
		}
	}

	async getQrCode(req: Request, res: Response) {
		try {
			const user = await userModel.findById(req.params.id);
			if (!user) {
				return res.status(404).send(
					new ApiResponse({
						error: true,
						message: "User tidak ditemukan",
					})
				);
			}

			const content = JSON.stringify({
				id: user._id,
				role: user.role,
			});

			const qrStream = new PassThrough();

			await QRCode.toFileStream(qrStream, content, {
				type: "png",
				width: 200,
				errorCorrectionLevel: "H",
				color: {
					dark: "#019267",
				},
			});

			qrStream.pipe(res);
		} catch (error) {
			res.status(400).send(validationError(error));
		}
	}

	async getAllKpm(_: Request, res: Response) {
		try {
			const users = await userModel.find(
				{
					role: "user",
				},
				"kpm"
			);

			res.send(
				new ApiResponse({
					error: false,
					data: users,
				})
			);
		} catch (error) {
			res.status(500).send({
				error: true,
				message: "Terjadi masalah di server",
				data: error,
			});
		}
	}

	async getAllByRole(req: Request, res: Response) {
		const role = req.params.role;

		const users = await userModel.find({
			role,
		});

		res.send(
			new ApiResponse({
				error: false,
				data: users,
			})
		);
	}

	async postUser(req: Request, res: Response) {
		try {
			const { nama, alamat, telpon, kpm, password } = req.body;

			const user = await userModel.create({
				nama,
				alamat,
				telpon,
				kpm,
				password,
				aktif: true,
				role: "user",
				saldo: 200000,
			});

			res.status(200).send(
				new ApiResponse({
					error: false,
					message: "User berhasil ditambahkan",
					data: user,
				})
			);
		} catch (error: any) {
			res.status(400).send(validationError(error, "Agen gagal ditambahkan"));
		}
	}

	async postAgen(req: Request, res: Response) {
		try {
			const { nama, namaToko, alamat, telpon, kode, password } = req.body;

			const user = await userModel.create({
				nama,
				namaToko,
				alamat,
				telpon,
				kode,
				password,
				aktif: true,
				role: "agen",
			});

			res.status(200).send(
				new ApiResponse({
					error: false,
					message: "Agen berhasil ditambahkan",
					data: user,
				})
			);
		} catch (error: any) {
			res.status(400).send(validationError(error));
		}
	}

	async put(req: Request, res: Response) {
		try {
			const id = req.params.id;

			const user = await userModel.findById(id);
			if (!user) {
				return res.status(404).send(
					new ApiResponse({
						error: true,
						message: "User tidak ditemukan",
					})
				);
			}

			const { nik, kpm, nama, namaToko, alamat, telpon, kode, password } =
				req.body;

			const update = JSON.parse(
				JSON.stringify({
					nik,
					kpm,
					nama,
					namaToko,
					alamat,
					telpon,
					kode,
					password,
				})
			);

			user.set(update);

			await user.save();

			res.status(200).send(
				new ApiResponse({
					error: false,
					message: "User berhasil diupdate",
					data: user,
				})
			);
		} catch (error: any) {
			res.status(400).send(validationError(error));
		}
	}

	async putStatus(req: Request, res: Response) {
		try {
			const id = req.params.id;

			const user = await userModel.findById(id);
			if (!user) {
				return res.status(404).send(
					new ApiResponse({
						error: true,
						message: "User tidak ditemukan",
					})
				);
			}
			const { aktif } = req.body;

			user.set({ aktif });

			await user.save();

			const message = aktif
				? `${user.role} berhasil diaktifkan`
				: `${user.role} berhasil dinonaktifkan`;

			res.status(200).send(
				new ApiResponse({
					error: false,
					message,
					data: user,
				})
			);
		} catch (error: any) {
			res.status(400).send(validationError(error));
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;

			userModel.deleteOne({ _id: id }, (err) => {
				if (err)
					return res.status(500).send(
						new ApiResponse({
							error: true,
							message: err.message,
						})
					);

				res.status(200).send(
					new ApiResponse({
						error: false,
						message: "User berhasil dihapus",
						data: id,
					})
				);
			});
		} catch (error) {
			res.status(400).send(validationError(error));
		}
	}
}

export default new UserController();
