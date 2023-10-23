import express from "express";
import { createProductCategory } from "../../controllers/productCategory";

const router = express.Router();

router.post("/admin/login", loginAdmin);
router.get("/admin", getAllAdmins);
router.get("/admin/:id", getOneAdmin);
router.post("/admin", createAdmin);
router.put("/admin/:id", updateAdmin);
router.delete("/admin/:id", deleteAdmin);

export default router;
