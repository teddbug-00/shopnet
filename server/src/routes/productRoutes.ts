import express, { NextFunction, Request, Response } from "express";
import { auth } from "../middleware/auth";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();

// Wrap the controller functions to ensure proper type handling
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post("/", auth, asyncHandler(createProduct));
router.get("/", auth, asyncHandler(getProducts));
router.get("/:id", auth, asyncHandler(getProduct));
router.put("/:id", auth, asyncHandler(updateProduct));
router.delete("/:id", auth, asyncHandler(deleteProduct));

export default router;
