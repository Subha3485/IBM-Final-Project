const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("../models/Recipe");

dotenv.config();

const mustHaveIndianRecipes = [
  "Paneer Butter Masala",
  "Paneer Makhani",
  "Dal Makhani",
  "Chole Masala",
  "Rajma Masala",
  "Palak Paneer",
  "Aloo Gobi",
  "Bhindi Masala",
  "Matar Paneer",
  "Kadhi Pakora",
  "Masala Dosa",
  "Idli & Sambar",
  "Veg Kurma",
  "Bisi Bele Bath",
  "Lemon Rice",
  "Curd Rice",
  "Vada",
  "Medu Vada",
  "Veg Dum Biryani",
  "Hyderabadi Biryani",
  "Veg Pulao",
  "Jeera Rice",
  "Chapati",
  "Roti",
  "Naan",
  "Paratha",
  "Poori",
  "Samosa",
  "Pani Puri",
  "Golgappa",
  "Dhokla",
  "Aloo Tikki",
  "Pakora",
  "Bhaji",
  "Butter Chicken",
  "Chicken Tikka Masala",
  "Rogan Josh",
  "Goan Pork Vindaloo",
  "Chicken Chettinad",
  "Gulab Jamun",
  "Kheer",
  "Jalebi",
  "Rasmalai",
  "Kaju Katli",
  "Masala Chai",
  "Lassi",
  "Filter Coffee",
];

function buildRecipe(title) {
  return {
    title,
    description: `${title} is a popular Indian dish from the curated must-have list.`,
    ingredients: ["salt", "turmeric", "cumin", "chili", "garam masala"],
    instructions: `Prepare ${title} using regional Indian spices and traditional cooking steps.`,
    image: "/images/Cookly-Logo.png",
    videoUrl: "",
    servings: 4,
    prepTime: 20,
    cookingTime: 30,
    difficulty: "Medium",
    cuisineType: "Indian",
    likes: 100,
  };
}

async function seedMustHaveIndianRecipes() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/cookly";
    await mongoose.connect(mongoUri);

    let upserted = 0;
    for (const title of mustHaveIndianRecipes) {
      const recipeData = buildRecipe(title);
      await Recipe.findOneAndUpdate(
        { title },
        {
          $set: {
            title: recipeData.title,
            cuisineType: recipeData.cuisineType,
            description: recipeData.description,
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
          },
          $setOnInsert: {
            image: recipeData.image,
            videoUrl: recipeData.videoUrl,
            servings: recipeData.servings,
            prepTime: recipeData.prepTime,
            cookingTime: recipeData.cookingTime,
            difficulty: recipeData.difficulty,
            likes: recipeData.likes,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upserted += 1;
    }

    const missing = [];
    for (const title of mustHaveIndianRecipes) {
      const exists = await Recipe.exists({ title });
      if (!exists) missing.push(title);
    }

    console.log(`Upserted ${upserted} must-have Indian recipes.`);
    console.log(`Missing after upsert: ${missing.length}`);
    if (missing.length) {
      console.log(missing.join(", "));
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed must-have Indian recipes:", error.message);
    process.exit(1);
  }
}

seedMustHaveIndianRecipes();
