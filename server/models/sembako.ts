import { Schema, Document, model, Types } from "mongoose";

export interface ISembako extends Document {
  agen: Types.ObjectId;
  nama: string;
  fotoUrl: string;
  harga: number;
  stok: number;
}

const schema: Schema = new Schema<ISembako>(
  {
    agen: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nama: String,
    fotoUrl: String,
    harga: Number,
    stok: Number,
  },
  { timestamps: true }
);

module.exports = model("Sembako", schema);
