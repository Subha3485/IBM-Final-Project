const mongoose = require("mongoose");

const connectDB = async () => {
    if (process.env.USE_MOCK_DATA === "true") {
        console.warn("Mock mode enabled (USE_MOCK_DATA=true). Skipping MongoDB connection.");
        return false;
    }

    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/cookly";
        
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 2000,
        });
        console.log("✓ MongoDB Connected Successfully!");
        return true;
    } catch (error) {
        console.warn("⚠ MongoDB not available. Running in mock mode.");
        console.warn("  To use MongoDB:");
        console.warn("  1. Install MongoDB locally or use MongoDB Atlas");
        console.warn("  2. Add MONGO_URI to .env file");
        console.warn("  3. Run: npm run seed (to populate recipes)");
        return false;
    }
};

module.exports = connectDB;
