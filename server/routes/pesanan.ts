import express from "express";
import PesananController from "../controller/pesanan";
// import { body, param } from "express-validator";
// import validate from "../middleware/validator";

const router = express.Router();

router.get("/:id", PesananController.get);
router.get("/agen/:idAgen", PesananController.getAllPesananAgen);

export default router;
