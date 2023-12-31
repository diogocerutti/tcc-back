import express from "express";
import {
  createUserAddress,
  updateUserAddress,
  getUserAddress,
  deleteUserAddress,
} from "../../controllers/user_adress/index.js";

const router = express.Router();

router.post("/user_address/:id_user", createUserAddress);
router.put("/user_address/:id_user", updateUserAddress);
router.get("/user_address/:id_user", getUserAddress);
router.delete("/user_address/:id_user", deleteUserAddress);

export default router;
