import express from "express";
import SembakoController from "../controller/sembako";

const router = express.Router();

router.get("/:idAgen", SembakoController.getAllSembakoAgen);
router.post("/", SembakoController.post);
router.put("/:id", SembakoController.put);

export default router;
