const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

function escapeRegex(value = "") {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Mock data for fallback when MongoDB is not available
const mockRecipes = [
    { 
        id: 1, 
        title: "Burger", 
        description: "Juicy homemade burger with fresh toppings and perfectly grilled meat",
        ingredients: ["meat", "buns", "lettuce", "tomato", "cheese"], 
        instructions: "Grill meat patty, toast buns, add lettuce and tomato, top with cheese", 
        image: "/images/burger.png",
        videoUrl: "https://www.youtube.com/embed/Aq0tVrcHsYQ",
        servings: 2,
        prepTime: 10,
        cookingTime: 15,
        difficulty: "Easy",
        cuisineType: "American",
        likes: 24,
        usersWhoLiked: []
    },
    { 
        id: 2, 
        title: "Tiramisu Cupcakes", 
        description: "Delightful Italian-inspired cupcakes with mascarpone frosting and cocoa",
        ingredients: ["flour", "eggs", "sugar", "cocoa", "mascarpone"], 
        instructions: "Mix batter, bake cupcakes, layer with mascarpone and cocoa", 
        image: "/images/image.png",
        videoUrl: "https://www.youtube.com/embed/4h1xQq-u5nQ",
        servings: 12,
        prepTime: 20,
        cookingTime: 25,
        difficulty: "Medium",
        cuisineType: "Italian",
        likes: 156,
        usersWhoLiked: []
    },
    { 
        id: 3, 
        title: "Cottage Cheese Chips", 
        description: "Crispy and savory cottage cheese chips, a healthy snacking alternative",
        ingredients: ["cottage cheese", "panko", "salt", "pepper", "oil"], 
        instructions: "Mix cottage cheese with seasonings, bake until crispy", 
        image: "/images/1.jpg",
        videoUrl: "https://www.youtube.com/embed/7vq0zR-k5L4",
        servings: 4,
        prepTime: 5,
        cookingTime: 20,
        difficulty: "Easy",
        cuisineType: "Healthy",
        likes: 89,
        usersWhoLiked: []
    },
    { 
        id: 4, 
        title: "Chopped Italian Sliders", 
        description: "Mini Italian sliders with pasta filling and melted mozzarella cheese",
        ingredients: ["ground beef", "pasta", "mozzarella", "slider buns", "marinara"], 
        instructions: "Mix italian ingredients, stuff sliders, toast and serve", 
        image: "/images/2.jpg",
        videoUrl: "https://www.youtube.com/embed/kqYQ3f0gl1A",
        servings: 4,
        prepTime: 15,
        cookingTime: 20,
        difficulty: "Medium",
        cuisineType: "Italian-American",
        likes: 203,
        usersWhoLiked: []
    },
    { 
        id: 5, 
        title: "Gluten Free Blondies", 
        description: "Chewy gluten-free blondies loaded with chocolate chips",
        ingredients: ["almond flour", "eggs", "butter", "vanilla", "chocolate chips"], 
        instructions: "Mix gluten-free flour blend, bake until golden", 
        image: "/images/2-5.jpg",
        videoUrl: "https://www.youtube.com/embed/WLfGHcEV8q4",
        servings: 8,
        prepTime: 10,
        cookingTime: 25,
        difficulty: "Easy",
        cuisineType: "Dessert",
        likes: 342,
        usersWhoLiked: []
    },
    { 
        id: 6, 
        title: "Soft and Chewy Glazed Lemon Cookies", 
        description: "Tangy lemon cookies with a sweet glaze that melts in your mouth",
        ingredients: ["flour", "sugar", "lemon zest", "butter", "eggs"], 
        instructions: "Cream butter and sugar, add lemon zest, bake and glaze", 
        image: "/images/3.jpg",
        videoUrl: "https://www.youtube.com/embed/XJTJBdJ_2pE",
        servings: 12,
        prepTime: 15,
        cookingTime: 12,
        difficulty: "Easy",
        cuisineType: "Dessert",
        likes: 127,
        usersWhoLiked: []
    },
    { 
        id: 7, 
        title: "Alabama Firecrackers", 
        description: "Fiery spiced crackers with a smooth pecan finish",
        ingredients: ["crackers", "butter", "hot sauce", "ranch seasoning", "pecan"], 
        instructions: "Toast crackers with spicy butter mixture until crispy", 
        image: "/images/4.jpg",
        videoUrl: "https://www.youtube.com/embed/1Xua3vI0GFc",
        servings: 6,
        prepTime: 5,
        cookingTime: 10,
        difficulty: "Easy",
        cuisineType: "Snack",
        likes: 95,
        usersWhoLiked: []
    },
    { 
        id: 8, 
        title: "Mini Chocolate Cupcakes", 
        description: "Adorable mini chocolate cupcakes perfect for parties and gatherings",
        ingredients: ["chocolate", "flour", "eggs", "sugar", "butter"], 
        instructions: "Bake small chocolate cupcakes with frosting", 
        image: "/images/5.jpg",
        videoUrl: "https://www.youtube.com/embed/TuN6cnOG3mQ",
        servings: 24,
        prepTime: 15,
        cookingTime: 15,
        difficulty: "Medium",
        cuisineType: "Dessert",
        likes: 234,
        usersWhoLiked: []
    },
    { 
        id: 9, 
        title: "Cheeseburger Cups", 
        description: "Creative bite-sized cheeseburger cups baked in muffin tins",
        ingredients: ["ground beef", "cheddar cheese", "buns", "pickles", "mustard"], 
        instructions: "Shape burger mixture in muffin tins, bake until cooked through", 
        image: "/images/6.jpg",
        videoUrl: "https://www.youtube.com/embed/0Ym56pN8pqU",
        servings: 12,
        prepTime: 15,
        cookingTime: 20,
        difficulty: "Medium",
        cuisineType: "American",
        likes: 178,
        usersWhoLiked: []
    },
    { 
        id: 10, 
        title: "Italian Meatloaf", 
        description: "Traditional Italian meatloaf with aromatic herbs and marinara sauce",
        ingredients: ["ground beef", "italian herbs", "breadcrumbs", "egg", "marinara"], 
        instructions: "Mix ingredients, shape into loaf, bake with marinara sauce", 
        image: "/images/7.jpg",
        videoUrl: "https://www.youtube.com/embed/7P-2p5S_m2U",
        servings: 6,
        prepTime: 15,
        cookingTime: 50,
        difficulty: "Easy",
        cuisineType: "Italian",
        likes: 145,
        usersWhoLiked: []
    },
];

const getRecipes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const fastMode = req.query.fast === "true";
        const cuisine = (req.query.cuisine || "").trim();
        const useMockData = process.env.USE_MOCK_DATA === "true";
        const isMongoConnected = mongoose.connection.readyState === 1;
        const filteredMockRecipes = cuisine
            ? mockRecipes.filter((r) => (r.cuisineType || "").toLowerCase() === cuisine.toLowerCase())
            : mockRecipes;

        // If mock mode is enabled or MongoDB is not connected, return mock data immediately.
        if (useMockData || !isMongoConnected) {
            return res.json({
                recipes: filteredMockRecipes.slice(skip, skip + limit),
                pagination: {
                    total: filteredMockRecipes.length,
                    pages: Math.ceil(filteredMockRecipes.length / limit),
                    currentPage: page
                }
            });
        }

        const mongoQuery = cuisine
            ? { cuisineType: new RegExp(`^${escapeRegex(cuisine)}$`, "i") }
            : {};

        // Try to get from database, but do not hang forever if query gets stuck.
        const recipes = await Promise.race([
            Recipe.find(mongoQuery)
                .sort({ likes: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .maxTimeMS(3000)
                .select("title image ingredients instructions likes cuisineType")
                .lean()
                .exec(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Recipe query timeout")), 3500))
        ]);

        if (recipes && recipes.length > 0) {
            const total = fastMode
                ? -1
                : await Promise.race([
                    Recipe.countDocuments(mongoQuery).maxTimeMS(2000).exec(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Count timeout")), 2200))
                ]).catch(() => recipes.length);
            return res.json({
                recipes,
                pagination: {
                    total,
                    pages: total > 0 ? Math.ceil(total / limit) : null,
                    currentPage: page
                }
            });
        }

        // Fallback to mock data
        res.json({
            recipes: filteredMockRecipes.slice(skip, skip + limit),
            pagination: {
                total: filteredMockRecipes.length,
                pages: Math.ceil(filteredMockRecipes.length / limit),
                currentPage: page
            }
        });
    } catch (error) {
        console.warn("Recipe API fallback:", error.message);
        const cuisine = (req.query.cuisine || "").trim();
        const filteredMockRecipes = cuisine
            ? mockRecipes.filter((r) => (r.cuisineType || "").toLowerCase() === cuisine.toLowerCase())
            : mockRecipes;
        res.json({
            recipes: filteredMockRecipes,
            pagination: {
                total: filteredMockRecipes.length,
                pages: 1,
                currentPage: 1
            }
        });
    }
};

const getCuisineTypes = async (req, res) => {
    try {
        const useMockData = process.env.USE_MOCK_DATA === "true";
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (useMockData || !isMongoConnected) {
            const cuisines = Array.from(
                new Set(mockRecipes.map((r) => (r.cuisineType || "").trim()).filter(Boolean))
            );
            return res.json({ cuisines });
        }

        const cuisines = await Recipe.distinct("cuisineType");
        return res.json({
            cuisines: cuisines.map((c) => (c || "").trim()).filter(Boolean)
        });
    } catch (error) {
        const cuisines = Array.from(
            new Set(mockRecipes.map((r) => (r.cuisineType || "").trim()).filter(Boolean))
        );
        return res.json({ cuisines });
    }
};

const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;

        // Try database first
        let recipe = await Recipe.findById(id).select("-usersWhoLiked").lean();

        if (!recipe) {
            // Fallback to mock data
            recipe = mockRecipes.find(r => r.id == id);
        }

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json(recipe);
    } catch (error) {
        // Fallback to mock data if ID is invalid
        const recipe = mockRecipes.find(r => r.id == req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        res.json(recipe);
    }
};

const addRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, image, videoUrl, servings, prepTime, cookingTime, difficulty, cuisineType } = req.body;
        
        const recipe = new Recipe({ 
            title, 
            description, 
            ingredients, 
            instructions, 
            image, 
            videoUrl,
            servings, 
            prepTime, 
            cookingTime, 
            difficulty, 
            cuisineType,
            likes: 0,
            usersWhoLiked: [],
            user: req.user?.id 
        });

        await recipe.save();
        res.json({ message: "Recipe added successfully", recipe });
    } catch (error) {
        res.status(500).json({ message: "Error adding recipe", error: error.message });
    }
};

const likeRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const rawUserId = req.user?.id;
        const anonymousLikeKey = String(req.headers["x-like-key"] || req.ip || "anonymous");
        const isAuthenticatedUser = !!rawUserId && mongoose.Types.ObjectId.isValid(rawUserId);

        // Try database first
        let recipe = await Recipe.findById(id);

        if (!recipe) {
            // Fallback to mock data
            recipe = mockRecipes.find(r => r.id == id);
            if (!recipe) {
                return res.status(404).json({ error: "Recipe not found" });
            }

            if (!Array.isArray(recipe.usersWhoLiked)) recipe.usersWhoLiked = [];
            if (!Array.isArray(recipe.likedByKeys)) recipe.likedByKeys = [];

            const keyIndex = recipe.likedByKeys.indexOf(anonymousLikeKey);
            if (keyIndex > -1) {
                recipe.likedByKeys.splice(keyIndex, 1);
                recipe.likes = Math.max(0, recipe.likes - 1);
            } else {
                recipe.likedByKeys.push(anonymousLikeKey);
                recipe.likes += 1;
            }

            return res.json({ likes: recipe.likes, liked: keyIndex === -1 });
        }

        if (!Array.isArray(recipe.usersWhoLiked)) recipe.usersWhoLiked = [];
        if (!Array.isArray(recipe.likedByKeys)) recipe.likedByKeys = [];

        if (isAuthenticatedUser) {
            // Database operations for signed-in users (ObjectId-safe path).
            const userIdStr = String(rawUserId);
            const likedIndex = recipe.usersWhoLiked.findIndex((u) => String(u) === userIdStr);
            if (likedIndex > -1) {
                recipe.usersWhoLiked.splice(likedIndex, 1);
                recipe.likes = Math.max(0, recipe.likes - 1);
                await recipe.save();
                return res.json({ likes: recipe.likes, liked: false });
            }
            recipe.usersWhoLiked.push(rawUserId);
            recipe.likes += 1;
            await recipe.save();
            return res.json({ likes: recipe.likes, liked: true });
        }

        // Anonymous like path using stable client key.
        const keyIndex = recipe.likedByKeys.indexOf(anonymousLikeKey);
        if (keyIndex > -1) {
            recipe.likedByKeys.splice(keyIndex, 1);
            recipe.likes = Math.max(0, recipe.likes - 1);
        } else {
            recipe.likedByKeys.push(anonymousLikeKey);
            recipe.likes += 1;
        }

        await recipe.save();
        res.json({ likes: recipe.likes, liked: keyIndex === -1 });
    } catch (error) {
        res.status(500).json({ error: "Error updating like", message: error.message });
    }
};

module.exports = { getRecipes, getCuisineTypes, getRecipeById, addRecipe, likeRecipe };
