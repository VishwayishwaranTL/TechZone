import mongoose from "mongoose";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error while fetching products:", error.message);
    res.status(500).json({ success: false, message: "Products not retrieved" });
  }
};

export const getProductId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching the product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const postProduct = async (req, res) => {
  try {
    const { name, brand, device, category, price, description, image, stock, discount, isAvailable } = req.body;

    if (!name || !brand || !device || !category || !price || !description || !image) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    const newProduct = new Product({
      name,
      brand,
      device,
      category,
      price,
      description,
      image,
      stock: stock || 0,
      discount: discount || 0,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting the product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const putProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const newReview = {
      user: req.user._id,
      name: `${user.firstName} ${user.lastName}`,
      rating,
      comment
    };

    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    await product.save();

    res.status(200).json({ success: true, message: "Review added", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
