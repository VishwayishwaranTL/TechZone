import express from "express";
import { getOrders, getOrdersByUserId, postOrder, putOrder } from "../controller/order.controller.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.get("/", getOrders);  
router.get("/user", authenticate, getOrdersByUserId); 
router.post("/", authenticate, postOrder);  
router.put("/:id", authenticate, putOrder);  

export default router;
