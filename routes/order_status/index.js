import express from "express";

import {
  getAllOrderStatus,
  createOrderStatus,
  updateOrderStatus,
  getOneOrderStatus,
  deleteOrderStatus,
} from "../../controllers/order_status/index.js";

const router = express.Router();

router.post("/order_status", createOrderStatus);
router.get("/order_status", getAllOrderStatus);
router.get("/order_status/:id", getOneOrderStatus);
router.put("/order_status/:id", updateOrderStatus);
router.delete("/order_status/:id", deleteOrderStatus);

export default router;
