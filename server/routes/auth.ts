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
router.post(
  "/login/admin",
  validate([body("username").notEmpty(), body("password").notEmpty()]),
  AuthController.loginAdmin
);
router.post(
  "/registrasi",
  validate([
    body("nik").isInt(),
    body("nama").notEmpty(),
    body("alamat").notEmpty(),
    body("telpon").isMobilePhone("id-ID").notEmpty(),
    body("username").notEmpty(),
    body("password").notEmpty(),
  ]),
  AuthController.registrasi
);

export default router;
