import express from "express";
import AuthController from "../controller/auth";

const router = express.Router();

router.get("/verify", AuthController.verifyToken);
router.post("/login", AuthController.login);

export default router;
