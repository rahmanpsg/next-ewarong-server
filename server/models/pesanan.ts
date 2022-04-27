import { Schema, Document, model, Types } from "mongoose";

export interface IPesanan extends Document {
  agen: Types.ObjectId;
  masyarakat: Types.ObjectId;
  sembako: Types.ObjectId;
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
    masyarakat: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sembako: {
      type: Schema.Types.ObjectId,
      ref: "Sembako",
      required: true,
    },
    jumlah: Number,
    status: Boolean,
    selesai: Boolean,
  },
  { timestamps: true }
);

module.exports = model("Pesanan", schema);
