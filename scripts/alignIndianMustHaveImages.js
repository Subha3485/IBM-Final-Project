const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("../models/Recipe");

dotenv.config();

const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const FALLBACK_IMAGE = "/images/Cookly-Logo.png";
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

function normalize(str = "") {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function titleTokens(str = "") {
  return normalize(str).split(" ").filter(Boolean);
}

function overlapScore(aTokens, bTokens) {
  const bSet = new Set(bTokens);
  return aTokens.reduce((acc, t) => acc + (bSet.has(t) ? 1 : 0), 0);
}

function mealScore(targetTitle, meal) {
  const tNorm = normalize(targetTitle);
  const mNorm = normalize(meal.strMeal || "");
  const tTokens = titleTokens(targetTitle);
  const mTokens = titleTokens(meal.strMeal || "");

  let score = 0;
  if (tNorm === mNorm) score += 70;
  if (mNorm.includes(tNorm) || tNorm.includes(mNorm)) score += 25;
  score += overlapScore(tTokens, mTokens) * 12;
  if ((meal.strArea || "").toLowerCase() === "indian") score += 20;
  return score;
}

async function fetchMeals(query) {
  const url = `${API_BASE}/search.php?s=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.meals) ? data.meals : [];
}

function candidateQueries(title) {
  const firstPart = title.split("/")[0].trim();
  const noAmp = title.replace("&", "and").trim();
  const words = title.split(" ").filter(Boolean);
  const twoWords = words.slice(0, 2).join(" ");
  return Array.from(new Set([title, firstPart, noAmp, twoWords].filter(Boolean)));
}

async function findBestImageForTitle(title) {
  let bestMeal = null;
  let best = -1;

  for (const query of candidateQueries(title)) {
    const meals = await fetchMeals(query);
    for (const meal of meals) {
      const score = mealScore(title, meal);
      if (score > best && meal.strMealThumb) {
        best = score;
        bestMeal = meal;
      }
    }
  }

  if (bestMeal && best >= 35) return bestMeal.strMealThumb;
  return FALLBACK_IMAGE;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cookly");

    let updated = 0;
    let matched = 0;
    let fallback = 0;

    for (const title of mustHaveIndianRecipes) {
      const image = await findBestImageForTitle(title);
      await Recipe.updateOne({ title }, { $set: { image, cuisineType: "Indian" } });
      updated += 1;
      if (image === FALLBACK_IMAGE) fallback += 1;
      else matched += 1;
    }

    console.log(`Processed ${updated} must-have Indian recipes.`);
    console.log(`Matched real images: ${matched}`);
    console.log(`Fallback logo images: ${fallback}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to align Indian recipe images:", error.message);
    process.exit(1);
  }
}

run();
