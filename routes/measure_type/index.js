import express from "express";
import {
  getAllMeasures,
  getOneMeasure,
  createMeasureType,
  updateMeasureType,
  deleteMeasureType,
} from "../../controllers/measure_type/index.js";

const router = express.Router();

router.post("/measure_type", createMeasureType);
router.get("/measure_type", getAllMeasures);
router.get("/measure_type/:id", getOneMeasure);
router.put("/measure_type/:id", updateMeasureType);
router.delete("/measure_type/:id", deleteMeasureType);

export default router;
