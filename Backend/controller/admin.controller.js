import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";  
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET
        );
        return res.json({ success: true, token });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAdminDetails = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.json(admin);
    } catch (error) {
        console.error("Error fetching admin details:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAllAdmins = async (req, res) => {
    try {
        if (req.admin.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized: Only admins can view this" });
        }

        const admins = await Admin.find().select("-password");
        res.status(200).json({ success: true, data: admins }); 
    } catch (error) {
        console.error("Error fetching admins:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");  
        res.status(200).json({ success: true, data: users });  
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const getAllProducts = async (req,res) => {
    try{
        const products = await Product.find();
        res.status(200).json({success:true, data:products});
    }catch(error){
        console.error("Error in fetching the products: ", error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }
}

export const addProduct = async (req, res) => {
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
  
  export const updateProduct = async (req, res) => {
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
  