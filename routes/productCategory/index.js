import express from "express";
import {
  createProductCategory,
  getAllCategories,
  getOneCategory,
  updateProductCategory,
  deleteProductCategory,
} from "../../controllers/productCategory/index.js";

const router = express.Router();

router.post("/product_category", createProductCategory);
router.get("/product_category", getAllCategories);
router.get("/product_category/:id", getOneCategory);
router.put("/product_category/:id", updateProductCategory);
router.delete("/product_category/:id", deleteProductCategory);

export default router;
