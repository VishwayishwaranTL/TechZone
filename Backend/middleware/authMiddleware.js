import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ success: false, message: " No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Decoded:", decoded); 

        if (!decoded.role || decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "❌ Forbidden: Admin access required" });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ success: false, message: "Token is invalid or expired" });
    }
};
