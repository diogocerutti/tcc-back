import express from "express";
import {
  createOrder,
  updateOrder,
  getAllOrders,
  getUserOrders,
} from "../../controllers/order/index.js";

const router = express.Router();

router.post("/order/:id_user", createOrder);
router.put("/order/:id", updateOrder);
router.get("/order", getAllOrders);
router.get("/order/:id", getUserOrders);
//router.delete("/measure_type/:id", deleteMeasureType);

export default router;
