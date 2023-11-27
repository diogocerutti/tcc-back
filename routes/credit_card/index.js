import express from "express";
import {
  getUserCreditCard,
  createUserCreditCard,
  updateUserCreditCard,
  deleteUserCreditCard,
} from "../../controllers/credit_card/index.js";

const router = express.Router();

router.post("/credit_card/:id_user", createUserCreditCard);
router.get("/credit_card/:id_user", getUserCreditCard);
router.put("/credit_card/:id_user", updateUserCreditCard);
router.delete("/credit_card/:id_user", deleteUserCreditCard);

export default router;
