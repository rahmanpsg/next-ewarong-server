import { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  nik: number;
  ktm: number;
  username: string;
  password: string;
  nama: string;
  telpon: string;
  alamat: string;
  fotoUrl: string;
  saldo: number;
  role: string; //admin, agen, masyarakat
  aktif: boolean;
}

const schema: Schema = new Schema<IUser>(
  {
    nik: {
      type: Number,
      unique: true,
      minlength: 16,
      maxlength: 16,
      required: true,
      validate: async (value: Number) => {
        const count = await models.User.countDocuments({ nik: value });
        if (count > 0) throw new Error("sudah terdaftar");
      },
    },
    ktm: {
      type: Number,
      unique: true,
      validate: async (value: Number) => {
        const count = await models.User.countDocuments({ ktm: value });
        if (count > 0) throw new Error("sudah terdaftar");
      },
    },
    username: {
      type: String,
      unique: true,
      validate: async (value: Number) => {
        const count = await models.User.countDocuments({ username: value });
        if (count > 0) throw new Error("sudah terdaftar");
      },
    },
    password: String,
    nama: String,
    telpon: {
      type: String,
      unique: true,
      required: true,
      validate: async (value: Number) => {
        const count = await models.User.countDocuments({ telpon: value });
        if (count > 0) throw new Error("sudah terdaftar");
      },
    },
    alamat: String,
    fotoUrl: String,
    saldo: Number,
    role: {
      type: String,
      enum: ["admin", "agen", "masyarakat"],
      default: "masyarakat",
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
