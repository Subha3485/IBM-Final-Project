const express = require("express");
const { getRecipes, addRecipe } = require("../controllers/recipeController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getRecipes);
router.post("/", authMiddleware, addRecipe);

module.exports = router;