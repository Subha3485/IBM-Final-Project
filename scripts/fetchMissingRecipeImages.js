const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("../models/Recipe");

dotenv.config();

const PLACEHOLDER_IMAGES = new Set([
  "/images/Cookly-Logo.png",
  "/images/Cookly-Logo.jpg",
  "",
  null,
  undefined,
]);

const THEMEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";
const WIKI_BASE = "https://en.wikipedia.org/w/api.php";

function normalize(str = "") {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(str = "") {
  return normalize(str).split(" ").filter(Boolean);
}

function scoreMatch(title, cuisineType, meal) {
  const t = normalize(title);
  const m = normalize(meal.strMeal || "");
  const tTokens = tokens(title);
  const mTokenSet = new Set(tokens(meal.strMeal || ""));

  let score = 0;
  if (t === m) score += 80;
  if (m.includes(t) || t.includes(m)) score += 35;
  for (const tk of tTokens) {
    if (mTokenSet.has(tk)) score += 10;
  }
  if ((cuisineType || "").toLowerCase() === "indian" && (meal.strArea || "").toLowerCase() === "indian") {
    score += 25;
  }
  return score;
}

function titleVariants(title) {
  const raw = title.trim();
  const noSymbols = raw.replace(/&/g, "and");
  const firstPart = raw.split("/")[0].trim();
  const words = raw.split(/\s+/).filter(Boolean);
  const firstTwo = words.slice(0, 2).join(" ");
  return Array.from(new Set([raw, noSymbols, firstPart, firstTwo].filter(Boolean)));
}

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "CooklyImageFixer/1.0" },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchFromMealDB(title, cuisineType) {
  let best = null;
  let bestScore = -1;

  for (const query of titleVariants(title)) {
    const data = await fetchJSON(`${THEMEALDB_BASE}/search.php?s=${encodeURIComponent(query)}`);
    const meals = Array.isArray(data?.meals) ? data.meals : [];
    for (const meal of meals) {
      if (!meal.strMealThumb) continue;
      const score = scoreMatch(title, cuisineType, meal);
      if (score > bestScore) {
        bestScore = score;
        best = meal.strMealThumb;
      }
    }
  }

  return bestScore >= 35 ? best : null;
}

async function fetchWikiImage(title, cuisineType) {
  const q = `${title} ${cuisineType || ""} recipe dish`;
  const search = await fetchJSON(
    `${WIKI_BASE}?action=query&list=search&format=json&srlimit=1&srsearch=${encodeURIComponent(q)}`
  );
  const result = search?.query?.search?.[0];
  if (!result?.title) return null;

  const imgData = await fetchJSON(
    `${WIKI_BASE}?action=query&prop=pageimages&piprop=original|thumbnail&pithumbsize=1000&format=json&titles=${encodeURIComponent(result.title)}`
  );

  const pages = imgData?.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  return firstPage?.original?.source || firstPage?.thumbnail?.source || null;
}

function needsFix(recipe) {
  if (PLACEHOLDER_IMAGES.has(recipe.image)) return true;
  if (typeof recipe.image !== "string" || !recipe.image.trim()) return true;

  if (recipe.image.startsWith("/images/")) {
    const localPath = path.join(process.cwd(), recipe.image.replace(/^\//, ""));
    return !fs.existsSync(localPath);
  }
  return false;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cookly");
    const recipes = await Recipe.find({}).select("_id title cuisineType image").lean();
    const targets = recipes.filter(needsFix);

    let updated = 0;
    let fromMealDB = 0;
    let fromWiki = 0;
    let unresolved = 0;

    for (const recipe of targets) {
      let image = await fetchFromMealDB(recipe.title, recipe.cuisineType);
      let source = "mealdb";

      if (!image) {
        image = await fetchWikiImage(recipe.title, recipe.cuisineType);
        source = "wikipedia";
      }

      if (!image) {
        unresolved += 1;
        continue;
      }

      await Recipe.updateOne({ _id: recipe._id }, { $set: { image } });
      updated += 1;
      if (source === "mealdb") fromMealDB += 1;
      if (source === "wikipedia") fromWiki += 1;
    }

    console.log(`Recipes needing image fix: ${targets.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Updated from TheMealDB: ${fromMealDB}`);
    console.log(`Updated from Wikipedia: ${fromWiki}`);
    console.log(`Still unresolved: ${unresolved}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to fetch missing recipe images:", error.message);
    process.exit(1);
  }
}

run();
