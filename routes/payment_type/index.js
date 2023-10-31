import express from "express";
import {
  createPaymentType,
  updatePaymentType,
  getAllPaymentTypes,
  getOnePaymentType,
  deletePaymentType,
} from "../../controllers/payment_type/index.js";

const router = express.Router();

router.post("/payment_type", createPaymentType);
router.put("/payment_type/:id", updatePaymentType);
router.get("/payment_type", getAllPaymentTypes);
router.get("/payment_type/:id", getOnePaymentType);
router.delete("/payment_type/:id", deletePaymentType);

export default router;
