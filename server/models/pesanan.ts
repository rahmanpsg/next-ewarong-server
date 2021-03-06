import { Schema, Document, model, Types } from "mongoose";

export interface IPesanan extends Document {
  agen: Types.ObjectId;
  user: Types.ObjectId;
  sembako: Types.ObjectId;
  harga: number;
  jumlah: number;
  status: boolean;
  selesai: boolean;
}

const schema: Schema = new Schema<IPesanan>(
  {
    agen: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sembako: {
      type: Schema.Types.ObjectId,
      ref: "Sembako",
      required: true,
    },
    harga: Number,
    jumlah: Number,
    status: Boolean,
    selesai: Boolean,
  },
  { timestamps: true }
);

module.exports = model("Pesanan", schema);
