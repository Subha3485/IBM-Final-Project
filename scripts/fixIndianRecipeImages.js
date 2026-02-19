const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("../models/Recipe");

dotenv.config();

const fallbackImagePool = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/7.jpg",
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/10.jpg",
  "/images/11.jpg",
  "/images/2-5.jpg",
  "/images/Cheddar-Bay-Biscuits-8.jpg",
  "/images/crispy_cauliflower_bites_700px.jpg",
  "/images/DSC_0013-7.jpg",
  "/images/DSC_00241.jpg",
  "/images/Fettuccine_Alfredo_PICTURE_1.jpg",
  "/images/Maccheroni_Ragu15.jpg",
  "/images/marrymechickpeas2-scaled.jpg",
  "/images/marrymechickpeas3-scaled.jpg",
  "/images/shamrock-smoothie-recipe-m-2.jpg",
];

function hashTitle(title = "") {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickImageForTitle(title) {
  const index = hashTitle(title) % fallbackImagePool.length;
  return fallbackImagePool[index];
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cookly");

    const query = {
      cuisineType: "Indian",
      image: { $in: ["/images/Cookly-Logo.jpg", "/images/Cookly-Logo.png", "", null] },
    };

    const recipes = await Recipe.find(query).select("_id title image").lean();

    let updated = 0;
    for (const recipe of recipes) {
      const image = pickImageForTitle(recipe.title);
      await Recipe.updateOne({ _id: recipe._id }, { $set: { image } });
      updated += 1;
    }

    const remaining = await Recipe.countDocuments(query);
    console.log(`Updated image placeholders for ${updated} Indian recipes.`);
    console.log(`Remaining placeholder-image Indian recipes: ${remaining}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to fix Indian recipe images:", error.message);
    process.exit(1);
  }
}

run();
