import { Document, Types } from "mongoose";

export interface ILaporan extends Document {
  sembakos: [
    {
      sembako: Types.ObjectId;
      jumlah: number;
    }
  ];
  bulan: number;
  tahun: number;
  total: number;
}

export interface ILaporanSembako {
  sembako: Types.ObjectId;
  jumlah: number;
}
