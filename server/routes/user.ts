import express from "express";
import UserController from "../controller/user";
import { param, body } from "express-validator";
import validate from "../middleware/validator";

const router = express.Router();

router.get(
  "/role/:role",
  validate([param("role").notEmpty()]),
  UserController.getAllByRole
);
router.get("/:id", validate([param("id").notEmpty()]), UserController.get);
router.put("/:id", validate([param("id").notEmpty()]), UserController.put);
router.put(
  "/status/:id",
  validate([param("id").notEmpty(), body("aktif").isBoolean().notEmpty()]),
  UserController.putStatus
);
router.delete(
  "/:id",
  validate([param("id").notEmpty()]),
  UserController.delete
);
router.post(
  "/user",
  validate([
    body("nama").notEmpty(),
    body("nik").isInt().notEmpty(),
    body("telpon").isMobilePhone("id-ID").notEmpty(),
    body("kpm").notEmpty(),
    body("password").notEmpty(),
    body("alamat").notEmpty(),
  ]),
  UserController.postUser
);
router.post(
  "/agen",
  validate([
    body("nama").notEmpty(),
    body("nik").isInt().notEmpty(),
    body("telpon").isMobilePhone("id-ID").notEmpty(),
    body("username").notEmpty(),
    body("password").notEmpty(),
    body("alamat").notEmpty(),
  ]),
  UserController.postAgen
);

export default router;
