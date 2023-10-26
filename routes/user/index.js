import express from "express";
import {
  loginUser,
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/user/index.js";

const router = express.Router();

router.post("/user/login", loginUser);
router.get("/user", getAllUsers);
router.get("/user/:id", getOneUser);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
