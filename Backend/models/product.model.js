import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    device: { type: String, required: true }, 
    category: { type: String, required: true }, 
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 }, 
    discount: { type: Number, default: 0 }, 
    rating: { type: Number, default: 0, min: 0, max: 5 }, 
    numReviews: { type: Number, default: 0 }, 
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

