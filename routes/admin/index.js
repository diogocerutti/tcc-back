import express from "express";
import {
  loginAdmin,
  getAllAdmins,
  getOneAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../controllers/admin/index.js";
import cors from "cors";

const router = express.Router();

router.use(cors({ origin: "http://localhost:3000", credentials: true }));
router.use(express.urlencoded({ extended: false }));

router.post("/admin/login", loginAdmin);
router.get("/admin", getAllAdmins);
router.get("/admin/:id", getOneAdmin);
router.post("/admin", createAdmin);
router.put("/admin/:id", updateAdmin);
router.delete("/admin/:id", deleteAdmin);

export default router;
