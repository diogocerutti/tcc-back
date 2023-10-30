import express from "express";
import {
  createUserAddress,
  updateUserAddress,
  getAllUserAddress,
  deleteUserAddress,
} from "../../controllers/user_adress/index.js";

const router = express.Router();

router.post("/user_address/:id_user", createUserAddress);
router.put("/user_address/:id", updateUserAddress);
router.get("/user_address/:id_user", getAllUserAddress);
router.delete("/user_address/:id", deleteUserAddress);

export default router;
