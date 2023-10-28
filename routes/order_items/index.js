import express from "express";
import { createOrderItem } from "../../controllers/order_items/index.js";

const router = express.Router();

router.post("/order_items", createOrderItem);
/* router.get("/measure_type", getAllMeasures);
router.get("/measure_type/:id", getOneMeasure);
router.put("/measure_type/:id", updateMeasureType);
router.delete("/measure_type/:id", deleteMeasureType); */

export default router;
