import express from "express";
import { createUserPayment } from "../../controllers/user_payment/index.js";

const router = express.Router();

router.post("/user_payment/:id_order", createUserPayment);
/* router.put("/payment_type/:id", updatePaymentType);
router.get("/payment_type", getAllPaymentTypes);
router.get("/payment_type/:id", getOnePaymentType);
router.delete("/payment_type/:id", deletePaymentType); */

export default router;
