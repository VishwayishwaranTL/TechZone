import express from "express";
import { loginAdmin, getAdminDetails, getAllAdmins, getAllProducts, addProduct, updateProduct, deleteProduct } from "../controller/admin.controller.js";
import { getAllUsers } from "../controller/admin.controller.js";  
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/user", authMiddleware, getAdminDetails);
router.get("/admins", authMiddleware, getAllAdmins);
router.get("/users", authMiddleware, getAllUsers);
router.get("/products", authMiddleware, getAllProducts);
router.post("/products", authMiddleware, addProduct);
router.put("/products/:id", authMiddleware, updateProduct);
router.delete("/products/:id", authMiddleware, deleteProduct);


export default router;
