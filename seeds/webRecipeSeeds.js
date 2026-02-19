const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("../models/Recipe");
const https = require("https");

dotenv.config();

const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const IMPORT_LIMIT = Number(process.env.WEB_SEED_LIMIT || 60);

function normalizeYoutubeToEmbed(url) {
  if (!url) return "";
  const match = url.match(/[?&]v=([^&]+)/);
  if (!match || !match[1]) return "";
  return `https://www.youtube.com/embed/${match[1]}`;
}

function toDifficulty(instructions = "") {
  const len = instructions.length;
  if (len < 350) return "Easy";
  if (len < 900) return "Medium";
  return "Hard";
}

function pickNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function extractIngredients(meal) {
  const items = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = (meal[`strIngredient${i}`] || "").trim();
    const measure = (meal[`strMeasure${i}`] || "").trim();
    if (!ingredient) continue;
    items.push(measure ? `${measure} ${ingredient}` : ingredient);
  }
  return items;
}

function mapMealToRecipe(meal) {
  const instructions = (meal.strInstructions || "").replace(/\s+/g, " ").trim();
  return {
    title: meal.strMeal || "Untitled Recipe",
    description: `A ${meal.strArea || "global"} ${meal.strCategory || "meal"} imported from TheMealDB.`,
    ingredients: extractIngredients(meal),
    instructions,
    image: meal.strMealThumb || "/images/burger.png",
    videoUrl: normalizeYoutubeToEmbed(meal.strYoutube),
    servings: pickNumber(2, 6),
    prepTime: pickNumber(10, 25),
    cookingTime: pickNumber(20, 50),
    difficulty: toDifficulty(instructions),
    cuisineType: meal.strArea || "International",
    likes: pickNumber(20, 400),
  };
}

async function fetchMealsByLetter(letter) {
  const url = `${API_BASE}/search.php?f=${letter}`;

  let payload;
  if (typeof fetch === "function") {
    const response = await fetch(url);
    if (!response.ok) return [];
    payload = await response.json();
  } else {
    payload = await new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let raw = "";
          res.on("data", (chunk) => {
            raw += chunk;
          });
          res.on("end", () => {
            try {
              resolve(JSON.parse(raw));
            } catch (err) {
              reject(err);
            }
          });
        })
        .on("error", reject);
    });
  }

  return Array.isArray(payload.meals) ? payload.meals : [];
}

async function seedFromWeb() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/cookly";
    await mongoose.connect(mongoUri);

    const allMeals = [];
    for (const letter of LETTERS) {
      const meals = await fetchMealsByLetter(letter);
      allMeals.push(...meals);
      if (allMeals.length >= IMPORT_LIMIT) break;
    }

    const deduped = Array.from(
      new Map(allMeals.map((meal) => [meal.idMeal, meal])).values()
    ).slice(0, IMPORT_LIMIT);

    const recipes = deduped.map(mapMealToRecipe);

    await Recipe.deleteMany({});
    await Recipe.insertMany(recipes);

    console.log(`Imported and seeded ${recipes.length} recipes from TheMealDB.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed recipes from web:", error.message);
    process.exit(1);
  }
}

seedFromWeb();
