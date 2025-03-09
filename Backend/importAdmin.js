import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import bcrypt from "bcrypt";
import Admin from "./models/admin.model.js";
import { connectDB } from "./config/db.js";

const importAdminData = async () => {
    try {
        await connectDB();
        const data = JSON.parse(fs.readFileSync("./admin.json", "utf-8")).admins;

        const hashedAdmins = await Promise.all(
            data.map(async (admin) => ({
                ...admin,
                password: await bcrypt.hash(admin.password, 10) 
            }))
        );

        await Admin.deleteMany(); 
        await Admin.insertMany(hashedAdmins);
        console.log("Admins imported successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error importing admin data:", error);
        process.exit(1); 
    }
};

importAdminData().catch(err => {
    console.error("Import process failed:", err);
    process.exit(1);
});
