import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import orderRoutes from "./routes/order.route.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const PORT = 5000;

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port: ${PORT}`);
});
