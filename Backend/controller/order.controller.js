import mongoose from "mongoose";
import Orders from "../models/order.model.js";
import Product from "../models/product.model.js";

export const getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.user?._id; 

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        const orders = await Orders.find({ userId }).sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Orders.find().sort({ createdAt: -1 });
        if (!orders.length) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error in fetching the orders", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const postOrder = async (req, res) => {
    try {
        console.log("Received Order Request:", req.body);

        const userId = req.user?._id;
        if (!userId) {
            console.error("User ID is missing.");
            return res.status(401).json({ success: false, message: "Unauthorized. User ID missing." });
        }

        const { purchases } = req.body;
        if (!purchases || purchases.length === 0) {
            console.error("Empty order received.");
            return res.status(400).json({ success: false, message: "No products in order." });
        }

        for (let purchase of purchases) {
            for (let product of purchase.products) {
                const dbProduct = await Product.findOne({ name: product.productname });
                if (!dbProduct) {
                    console.error(`Product not found: ${product.productname}`);
                    return res.status(404).json({ success: false, message: `Product ${product.productname} not found.` });
                }
                if (dbProduct.stock < product.quantity) {
                    console.error(`Not enough stock for: ${product.productname}`);
                    return res.status(400).json({ success: false, message: `Not enough stock for ${product.productname}.` });
                }
                dbProduct.stock -= product.quantity;
                await dbProduct.save();
            }
        }

        const newOrder = new Orders({
            userId,
            purchases,
            orderId: new mongoose.Types.ObjectId().toHexString(),
            createdAt: Date.now(),
        });

        const savedOrder = await newOrder.save();
        console.log("Order saved successfully:", savedOrder);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: {
                _id: savedOrder._id,
                orderId: savedOrder.orderId,
                purchases: savedOrder.purchases,
                createdAt: savedOrder.createdAt,
                totalWithGST: purchases[0].total 
            }
        });

    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const putOrder = async (req, res) => {
    const { id } = req.params;
    const order = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Order ID" });
    }

    try {
        const updatedOrder = await Orders.findByIdAndUpdate(id, order, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error("Error updating the order", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Order ID" });
        }

        const deletedOrder = await Orders.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
