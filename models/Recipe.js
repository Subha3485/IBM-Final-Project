const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    ingredients: [String],
    instructions: String,
    image: String,
    videoUrl: { type: String, default: "" },
    servings: { type: Number, default: 4 },
    prepTime: { type: Number, default: 15 }, // in minutes
    cookingTime: { type: Number, default: 30 }, // in minutes
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium", index: true },
    cuisineType: { type: String, default: "General", index: true },
    likes: { type: Number, default: 0, index: true },
    usersWhoLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likedByKeys: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

// Add compound index for faster sorting
recipeSchema.index({ likes: -1, createdAt: -1 });
recipeSchema.index({ cuisineType: 1, difficulty: 1 });

module.exports = mongoose.model("Recipe", recipeSchema);
