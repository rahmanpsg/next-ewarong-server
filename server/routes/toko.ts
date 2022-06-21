import express from "express";
import TokoController from "../controller/toko";

const router = express.Router();

router.get("/", TokoController.getAll);

export default router;
