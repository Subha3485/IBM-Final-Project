const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    googleId: { type: String, default: "" },
    facebookId: { type: String, default: "" },
    authProvider: { type: String, default: "local" },
    avatar: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
