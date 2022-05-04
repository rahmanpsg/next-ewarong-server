import express from "express";
import SembakoController from "../controller/sembako";
import { body, param } from "express-validator";
import validate from "../middleware/validator";

const router = express.Router();

router.get("/", SembakoController.getAll);
router.get(
  "/search/:keyword",
  validate([param("keyword").notEmpty()]),
  SembakoController.getByKeyword
);
router.get("/agen/:idAgen", SembakoController.getAllSembakoAgen);
router.post(
  "/:idAgen",
  validate([
    param("idAgen").notEmpty(),
    body("nama").notEmpty(),
    body("harga").notEmpty().isInt(),
    body("stok").notEmpty().isInt(),
  ]),
  SembakoController.post
);
router.put(
  "/:id",
  validate([
    param("id").notEmpty(),
    body("nama").notEmpty(),
    body("harga").notEmpty().isInt(),
    body("stok").notEmpty().isInt(),
  ]),
  SembakoController.put
);

export default router;
