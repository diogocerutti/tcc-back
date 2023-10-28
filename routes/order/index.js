import express from "express";
import {
  createOrder,
  updateOrder,
  getAllOrders,
} from "../../controllers/order/index.js";

const router = express.Router();

router.post("/order", createOrder);
router.put("/order/:id", updateOrder);
router.get("/order", getAllOrders);
/* router.get("/measure_type/:id", getOneMeasure);
router.delete("/measure_type/:id", deleteMeasureType); */

export default router;
