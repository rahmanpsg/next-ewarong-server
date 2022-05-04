import { Request, Response } from "express";
import { Model } from "mongoose";
import { IPesanan } from "server/models/pesanan";
import { ISembako } from "../models/sembako";
import { ILaporan, ILaporanSembako } from "../models/laporan";

const pesananModel: Model<IPesanan> = require("../models/pesanan");
const sembakoModel: Model<ISembako> = require("../models/sembako");

const ObjectId = require("mongoose").Types.ObjectId;

class LaporanController {
  // laporan agen per bulan
  async getAllLaporanAgen(req: Request, res: Response) {
    const agen = req.params.id;

    // create report pesanan per bulan
    let laporans = await pesananModel.aggregate([
      {
        $match: {
          agen: new ObjectId(agen),
          status: true,
          selesai: true,
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$updatedAt",
            },
            year: {
              $year: "$updatedAt",
            },
          },
          sembakos: {
            $push: {
              sembako: "$sembako",
              jumlah: "$jumlah",
            },
          },
          total: {
            $sum: "$jumlah",
          },
          pendapatan: {
            $sum: {
              $multiply: ["$jumlah", "$harga"],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          bulan: "$_id.month",
          tahun: "$_id.year",
          sembakos: "$sembakos",
          jumlah: "$jumlah",
          total: "$total",
          pendapatan: "$pendapatan",
        },
      },
      {
        $sort: {
          bulan: 1,
          tahun: 1,
        },
      },
    ]);

    laporans = laporans.map((laporan: ILaporan) => {
      let _sembakos: ILaporanSembako[] = [];

      for (const sembako of laporan.sembakos) {
        const _sembako = _sembakos.find(
          (s) => s.sembako.toString() == sembako.sembako.toString()
        );

        if (_sembako != undefined) {
          _sembako.jumlah += sembako.jumlah;
          continue;
        }

        _sembakos.push({
          sembako: sembako.sembako,
          jumlah: sembako.jumlah,
        });
      }

      return {
        ...laporan,
        sembakos: _sembakos,
      };
    });

    const populateQuery = [
      {
        path: "sembakos.sembako",
        model: sembakoModel,
        select: "nama",
      },
    ];

    const result = await pesananModel.populate(laporans, populateQuery);

    res.send({
      error: false,
      data: result,
    });
  }
}

export default new LaporanController();
