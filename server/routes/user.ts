import express from "express";
import UserController from "../controller/user";

const router = express.Router();

router.get("/agen", UserController.getAllAgen);
router.put("/:id", UserController.put);

export default router;
