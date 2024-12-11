import express, { Request, Response, NextFunction } from "express";
import { auth } from "../middleware/auth";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController";

const router = express.Router();

// Wrap controller functions to handle promise rejections
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get("/", auth, asyncHandler(getNotifications));
router.put("/:id/read", auth, asyncHandler(markAsRead));
router.put("/mark-all-read", auth, asyncHandler(markAllAsRead));
router.delete("/:id", auth, asyncHandler(deleteNotification));

export default router;
