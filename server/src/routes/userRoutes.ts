import express, { Router } from "express";
import {
  register,
  login,
  updateAccountType,
} from "../controllers/userController";
import { auth } from "../middleware/auth";

const router: Router = express.Router();

router.post("/register", (req, res) => register(req, res));
router.post("/login", (req, res) => login(req, res));
router.put("/account-type", auth, (req, res) => updateAccountType(req, res));

export default router;
