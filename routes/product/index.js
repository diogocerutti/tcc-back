import express from "express";
import {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
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
router.put("/product/:id", upload.single("image"), updateProduct);
router.delete("/product/:id", deleteProduct);

export default router;
