import express from "express";
import AuthController from "../controller/auth";
import { body } from "express-validator";
import validate from "../middleware/validator";

const router = express.Router();

router.get("/verify", AuthController.verifyToken);
router.post(
  "/login",
  validate([
    body("username"),
    body("ktm").if(body("username").isEmpty()).isInt(),
    body("password").notEmpty(),
  ]),
  AuthController.login
);

export default router;
