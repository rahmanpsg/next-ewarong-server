import express from "express";
import PesananController from "../controller/pesanan";
import { body, param } from "express-validator";
import validate from "../middleware/validator";

const router = express.Router();

router.get(
  "/agen/:id",
  validate([param("id").notEmpty()]),
  PesananController.getAllPesananAgen
);
router.get(
  "/masyarakat/:id",
  validate([param("id").notEmpty()]),
  PesananController.getAllPesananAgen
);
router.get("/:id", validate([param("id").isInt()]), PesananController.get);
router.post(
  "/",
  validate([
    body("masyarakat").notEmpty().withMessage("ID masyarakat harus diisi"),
    body("agen").notEmpty().withMessage("ID agen harus diisi"),
    body("sembako").notEmpty(),
    body("jumlah").isInt(),
  ]),
  PesananController.post
);

export default router;
