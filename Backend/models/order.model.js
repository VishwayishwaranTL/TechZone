import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    purchases: [
        {
            products: [
                {
                    productname: { type: String, required: true },
                    quantity: { type: Number, required: true },
                },
            ],
            total: { type: Number, required: true },
            address: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, required: true },
        },
    ],
    orderId: { type: String }, 
    createdAt: { type: Date, default: Date.now },
});

const Orders = mongoose.model("Orders", orderSchema);
export default Orders;
