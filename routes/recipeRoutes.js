const express = require("express");
const { getRecipes, getCuisineTypes, getRecipeById, addRecipe, likeRecipe } = require("../controllers/recipeControllers");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getRecipes);
router.get("/cuisines", getCuisineTypes);
router.get("/:id", getRecipeById);
router.post("/", authMiddleware, addRecipe);
router.post("/:id/like", likeRecipe);

module.exports = router;
