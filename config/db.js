const mongoose = require("mongoose");

const connectDB = async () => {
    if (process.env.USE_MOCK_DATA === "true") {
        console.warn("Mock mode enabled (USE_MOCK_DATA=true). Skipping MongoDB connection.");
        return false;
    }

    try {
        const mongoUri =
            process.env.MONGO_URI ||
            process.env.MONGODB_URI ||
            process.env.MONGO_URI_ATLAS ||
            (process.env.NODE_ENV === "production" ? null : "mongodb://localhost:27017/cookly");

        if (!mongoUri) {
            console.warn("MongoDB URI is missing. Set MONGO_URI (or MONGODB_URI).");
            console.warn("Starting without DB connection (mock fallback mode).");
            return false;
        }

        const serverSelectionTimeoutMS = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000);

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS,
        });

        console.log("MongoDB connected successfully.");
        return true;
    } catch (error) {
        console.warn("MongoDB not available. Running in mock mode.");
        console.warn(`MongoDB error: ${error.message}`);
        console.warn("To use MongoDB:");
        console.warn("1. Install MongoDB locally or use MongoDB Atlas");
        console.warn("2. Add MONGO_URI (or MONGODB_URI) to your environment");
        console.warn("3. Run: npm run seed (to populate recipes)");
        return false;
    }
};

module.exports = connectDB;
