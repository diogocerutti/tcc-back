import express from "express";
import {
  getAllProducts,
  getOneProduct,
  createProduct,
} from "../../controllers/product/index.js";
import { productValidator } from "../../validators/productValidator.js";
import { upload } from "../../utils/upload.js";

const router = express.Router();

router.post(
  "/product",
  upload.single("image"),
  productValidator,
  createProduct
);
router.get("/product", getAllProducts);
router.get("/product/:id", getOneProduct);

export default router;
