import express from "express";
import {
  updateProfile,
  changePassword,
  updateNotificationPreferences,
} from "../controllers/settingsController";
import { auth } from "../middleware/auth";

const router = express.Router();

// Explicitly type the handlers
router.put("/profile", auth, (req, res) => updateProfile(req, res));
router.put("/password", auth, (req, res) => changePassword(req, res));
router.put("/notifications", auth, (req, res) =>
  updateNotificationPreferences(req, res),
);

export default router;
