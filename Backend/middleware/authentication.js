import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
    try {
        const getTokenFromHeader = () => {
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
                return req.headers.authorization.split(" ")[1];
            }
            return null;
        };

        const token = getTokenFromHeader();
        if (!token) {
            console.error("No token found in request headers");
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment variables.");
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("JWT Decoded Successfully:", decoded); 
        } catch (error) {
            console.error("JWT Verification Failed:", error.message);
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }

        const userId = decoded.userId || decoded.id; 
        if (!userId) {
            console.error("JWT payload does not contain a valid userId:", decoded);
            return res.status(401).json({ success: false, message: "Invalid token payload" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            console.error("User not found in database:", userId);
            return res.status(401).json({ success: false, message: "User not found. Unauthorized access." });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Authentication Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
        }

        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
