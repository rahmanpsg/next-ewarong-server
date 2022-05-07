import express from "express";
import PesananController from "../controller/pesanan";
import { body, check, param } from "express-validator";
import validate from "../middleware/validator";

const router = express.Router();

router.get(
  "/agen/:id",
  validate([param("id").notEmpty()]),
  PesananController.getAllPesananAgen
);

router.get(
  "/user/:id",
  validate([param("id").notEmpty()]),
  PesananController.getAllPesananUser
);

router.get(
  "/selesai/agen/:id",
  validate([param("id").notEmpty()]),
  PesananController.getAllTransaksiAgen
);

router.get(
  "/selesai/user/:id",
  validate([param("id").notEmpty()]),
  PesananController.getAllTransaksiUser
);

router.get("/:id", validate([param("id").isInt()]), PesananController.get);

router.post(
  "/",
  validate([
    body("user").notEmpty().withMessage("ID user tidak boleh kosong"),
    body("agen").notEmpty().withMessage("ID agen tidak boleh kosong"),
    body("sembako").notEmpty(),
    body("jumlah").isInt(),
  ]),
  PesananController.post
);

router.put(
  "/konfirmasi/:role/:id",
  validate([
    param("role").notEmpty(),
    check("role").isIn(["agen", "user"]),
    param("id").notEmpty(),
    body("status").isBoolean(),
    body("selesai")
      .if(param("role").isIn(["user"]))
      .isBoolean(),
  ]),
  PesananController.konfirmasi
);

export default router;
