import express from "express";
import { deleteProduct, getProduct, getProductId, postProduct, putProduct, addReview } from "../controller/product.controller.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.post("/", postProduct);
router.get("/", getProduct);
router.get("/:id", getProductId);
router.delete("/:id", deleteProduct);
router.put("/:id", putProduct);
router.post("/:id/review", authenticate, addReview); 

export default router;
