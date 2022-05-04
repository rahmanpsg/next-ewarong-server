import express from "express";
import LaporanController from "../controller/laporan";
import { param } from "express-validator";
import validate from "../middleware/validator";

const router = express.Router();

router.get(
  "/agen/:id",
  validate([param("id").notEmpty()]),
  LaporanController.getAllLaporanAgen
);

export default router;
