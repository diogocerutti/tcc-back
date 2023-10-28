import express from "express";
import { createOrder } from "../../controllers/order/index.js";

const router = express.Router();

router.post("/order", createOrder);
/* router.get("/measure_type", getAllMeasures);
router.get("/measure_type/:id", getOneMeasure);
router.put("/measure_type/:id", updateMeasureType);
router.delete("/measure_type/:id", deleteMeasureType); */

export default router;
