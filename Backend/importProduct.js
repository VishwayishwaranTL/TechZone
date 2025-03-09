import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import Product from "./models/product.model.js";
import { connectDB } from "./config/db.js";

const importData = async () => {
    try {
        await connectDB();
        const data = JSON.parse(fs.readFileSync("./product.json", "utf-8"));
        await Product.deleteMany();
        await Product.insertMany(data);
        console.log("Products imported successfully");
        process.exit(0); 
    } catch (error) {
        console.error("Error importing data: ", error);
        process.exit(1); 
    }
};

importData().then(() => {
    console.log("Import process finished."); 
}).catch(err => {
    console.error("Overall import error:", err);
    process.exit(1); 
});
