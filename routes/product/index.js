import express from "express";
import {
  getAllProducts,
  getOneProduct,
  createProduct,
} from "../../controllers/product/index.js";
import { productValidator } from "../../validators/productValidator.js";

const router = express.Router();

router.post("/product", productValidator, createProduct);
router.get("/product", getAllProducts);
router.get("/product/:id", getOneProduct);

export default router;
