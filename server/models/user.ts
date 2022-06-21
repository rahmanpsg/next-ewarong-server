import { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
	nik: number;
	kpm: number;
	username: string;
	password: string;
	nama: string;
	namaToko: string;
	telpon: string;
	alamat: string;
	fotoUrl: string;
	saldo: number;
	role: string; //admin, agen, user
	aktif: boolean;
}

const schema: Schema = new Schema<IUser>(
	{
		nik: {
			type: Number,
			// unique: true,
			minlength: [16, "NIK harus 16 digit"],
			maxlength: [16, "NIK harus 16 digit"],
			required: false,
			validate: async function (value: Number) {
				if (value == null) return;

				const user = await models.User.findById((this as IUser).id);

				if (user != null && user.nik === value) return;

				const count = await models.User.countDocuments({ nik: value });

				if (count > 0) throw new Error("sudah terdaftar");
			},
		},
		kpm: {
			type: Number,
			validate: async function (value: Number) {
				const user = await models.User.findById((this as IUser).id);

				if (user != null && user.kpm === value) return;

				const count = await models.User.countDocuments({ kpm: value });
				if (count > 0) throw new Error("sudah terdaftar");
			},
		},
		username: {
			type: String,
			validate: async function (value: String) {
				const user = await models.User.findById((this as IUser).id);

				if (user != null && user.username === value) return;

				const count = await models.User.countDocuments({ username: value });
				if (count > 0) throw new Error("sudah terdaftar");
			},
		},
		password: String,
		nama: String,
		namaToko: String,
		telpon: {
			type: String,
			unique: true,
			required: true,
			validate: async function (value: Number) {
				const user = await models.User.findById((this as IUser).id);

				if (user != null && user.telpon === value) return;

				const count = await models.User.countDocuments({ telpon: value });
				if (count > 0) throw new Error("sudah terdaftar");
			},
		},
		alamat: String,
		fotoUrl: String,
		saldo: Number,
		role: {
			type: String,
			enum: ["admin", "agen", "user"],
			default: "user",
			required: true,
		},
		aktif: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("User", schema);
