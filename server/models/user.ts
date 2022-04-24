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
    role: {
      type: String,
      default: "masyarakat",
      required: true,
    },
  },
  { timestamps: true }
);

schema.pre("save", function () {
  if (this.telpon.startsWith("08")) {
    this.telpon = this.telpon.replace("08", "628");
  }
});

schema.pre("deleteOne", function (next) {
  try {
    const id = this.getQuery()["_id"];

    model("Pembayaran").deleteMany({ user: id }, (err) => {
      if (err) return next(err);

      next();
    });

    model("Pengaduan").deleteMany({ user: id }, (err) => {
      if (err) return next(err);

      next();
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = model("User", schema);
