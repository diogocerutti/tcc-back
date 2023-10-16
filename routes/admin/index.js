import express from "express";
import {
  getAllAdmins,
  getOneAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../controllers/admin/index.js";

const router = express.Router();

router.get("/admin", getAllAdmins);
router.get("/admin/:id", getOneAdmin);
router.post("/admin", createAdmin);
router.put("/admin/:id", updateAdmin);
router.delete("/admin/:id", deleteAdmin);

export default router;
