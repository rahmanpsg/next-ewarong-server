import express from "express";
import UserController from "../controller/user";
import { param } from "express-validator";
import validate from "../middleware/validator";

const router = express.Router();

router.get(
  "/role/:role",
  validate([param("role").notEmpty()]),
  UserController.getAllByRole
);
router.get("/:id", validate([param("id").notEmpty()]), UserController.get);
router.put("/:id", validate([param("id").notEmpty()]), UserController.put);

export default router;
