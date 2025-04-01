const Recipe = require("../models/Recipe");

const getRecipes = async (req, res) => {
    const recipes = await Recipe.find().populate("user", "name email");
    res.json(recipes);
};

const addRecipe = async (req, res) => {
    const { title, ingredients, instructions, image } = req.body;
    const recipe = new Recipe({ title, ingredients, instructions, image, user: req.user.id });
    await recipe.save();
    res.json({ message: "Recipe added successfully" });
};

module.exports = { getRecipes, addRecipe };