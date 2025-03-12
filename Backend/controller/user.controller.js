import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getTimestamp = () => new Date().toISOString();

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, dob, email, password } = req.body;

        if (!firstName || !lastName || !dob || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            dob,
            email,
            password: hashedPassword, 
        });

        await newUser.save();

        console.log(`[${getTimestamp()}] User Registered: ${email}, Name: ${firstName} ${lastName}`);

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        console.error("SignUp error:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);

        console.log(`[${getTimestamp()}] User Logged In: ${email}`);

        res.status(200).json({ success: true, message: "Login successful", token, user: { id: user._id, firstName: user.firstName, email: user.email } });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateUserById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; 

    if (!id || !updates) {
        return res.status(400).json({ success: false, message: "Invalid data" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { $set: updates }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Server Error" });
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