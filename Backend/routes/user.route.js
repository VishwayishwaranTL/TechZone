import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserById, getAllUsers } from "../controller/user.controller.js";
import { authenticate } from "../middleware/authentication.js"; 
import { authMiddleware } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticate, getUserProfile);
router.put("/update/:id", authenticate, updateUserById);
router.get("/all", authMiddleware, getAllUsers);

export default router;
