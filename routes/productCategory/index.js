import express from "express";
import { createProductCategory } from "../../controllers/productCategory/index.js";

const router = express.Router();

router.post("/product_category", createProductCategory);

export default router;
