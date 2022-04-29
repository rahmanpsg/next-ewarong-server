import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  nik: number;
  ktm: number;
  username: string;
  password: string;
  nama: string;
  telpon: string;
  alamat: string;
  foto: string;
  saldo: number;
  role: string; //admin, agen, masyarakat
}

const schema: Schema = new Schema<IUser>(
  {
    nik: {
      type: Number,
      unique: true,
      minlength: 16,
      maxlength: 16,
      required: true,
    },
    ktm: {
      type: Number,
      unique: true,
    },
    username: String,
    password: String,
    nama: String,
    telpon: {
      type: String,
      unique: true,
      required: true,
    },
    alamat: String,
    foto: String,
    saldo: Number,
    role: {
      type: String,
      default: "masyarakat",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("User", schema);
