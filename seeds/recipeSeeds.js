const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("../models/Recipe");

// Load values from .env (for example MONGO_URI).
dotenv.config();

// Sample recipes inserted when running `npm run seed`.
const recipes = [
    {
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
        likes: 24
    },
    {
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
        likes: 156
    },
    {
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
        likes: 89
    },
    {
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
        likes: 203
    },
    {
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
        likes: 342
    },
    {
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
        likes: 127
    },
    {
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
        likes: 95
    },
    {
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
        likes: 234
    },
    {
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
        likes: 178
    },
    {
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
        likes: 145
    },
    {
        title: "Veggie Stir Fry",
        description: "Colorful and nutritious vegetable stir fry with soy sauce",
        ingredients: ["broccoli", "carrots", "bell peppers", "soy sauce", "garlic"],
        instructions: "Heat oil, add vegetables, stir fry with soy sauce and garlic",
        image: "/images/stir-fry.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 4,
        prepTime: 15,
        cookingTime: 10,
        difficulty: "Easy",
        cuisineType: "Asian",
        likes: 112
    },
    {
        title: "Creamy Pasta Alfredo",
        description: "Rich and creamy pasta with parmesan cheese sauce",
        ingredients: ["pasta", "cream", "butter", "parmesan", "garlic"],
        instructions: "Cook pasta, make butter and cream sauce, toss with parmesan",
        image: "/images/alfredo.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 3,
        prepTime: 10,
        cookingTime: 20,
        difficulty: "Easy",
        cuisineType: "Italian",
        likes: 198
    },
    {
        title: "Spicy Thai Curry",
        description: "Aromatic and spicy Thai red curry with coconut milk",
        ingredients: ["chicken", "coconut milk", "red curry paste", "basil", "lime"],
        instructions: "Fry curry paste, add coconut milk and chicken, simmer until cooked",
        image: "/images/thai-curry.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 4,
        prepTime: 15,
        cookingTime: 30,
        difficulty: "Medium",
        cuisineType: "Thai",
        likes: 267
    },
    {
        title: "Greek Salad",
        description: "Fresh and healthy salad with feta cheese and olives",
        ingredients: ["tomatoes", "cucumber", "feta cheese", "olives", "onion"],
        instructions: "Chop vegetables, add feta and olives, dress with olive oil",
        image: "/images/greek-salad.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 2,
        prepTime: 10,
        cookingTime: 0,
        difficulty: "Easy",
        cuisineType: "Greek",
        likes: 134
    },
    {
        title: "Chocolate Brownies",
        description: "Rich and fudgy chocolate brownies, a chocolate lover's dream",
        ingredients: ["dark chocolate", "butter", "eggs", "sugar", "flour"],
        instructions: "Melt chocolate with butter, mix with eggs and sugar, bake",
        image: "/images/brownies.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 8,
        prepTime: 10,
        cookingTime: 30,
        difficulty: "Easy",
        cuisineType: "Dessert",
        likes: 421
    },
    {
        title: "Caesar Wrap",
        description: "Crispy wrap filled with grilled chicken and caesar dressing",
        ingredients: ["tortilla", "chicken", "caesar dressing", "lettuce", "parmesan"],
        instructions: "Grill chicken, assemble in tortilla with dressing and lettuce",
        image: "/images/wrap.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 1,
        prepTime: 10,
        cookingTime: 10,
        difficulty: "Easy",
        cuisineType: "American",
        likes: 156
    },
    {
        title: "Fish Tacos",
        description: "Light and refreshing fish tacos with slaw and lime crema",
        ingredients: ["fish", "tortillas", "cabbage slaw", "lime crema", "cilantro"],
        instructions: "Fry fish, warm tortillas, assemble with slaw and crema",
        image: "/images/tacos.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 3,
        prepTime: 15,
        cookingTime: 15,
        difficulty: "Medium",
        cuisineType: "Mexican",
        likes: 289
    },
    {
        title: "Banana Bread",
        description: "Moist and delicious banana bread perfect for breakfast",
        ingredients: ["ripe bananas", "flour", "sugar", "eggs", "butter"],
        instructions: "Mash bananas, mix with flour and sugar, bake until golden",
        image: "/images/banana-bread.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 10,
        prepTime: 15,
        cookingTime: 45,
        difficulty: "Easy",
        cuisineType: "Dessert",
        likes: 367
    },
    {
        title: "Beef Tacos",
        description: "Classic beef tacos with toppings and salsa",
        ingredients: ["ground beef", "tortillas", "lettuce", "tomato", "salsa"],
        instructions: "Brown beef with spices, warm tortillas, assemble tacos",
        image: "/images/beef-tacos.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 4,
        prepTime: 10,
        cookingTime: 15,
        difficulty: "Easy",
        cuisineType: "Mexican",
        likes: 276
    },
    {
        title: "Vegetable Soup",
        description: "Hearty and warming vegetable soup with fresh herbs",
        ingredients: ["vegetables", "broth", "herbs", "garlic", "onion"],
        instructions: "Sauté vegetables, add broth and herbs, simmer until tender",
        image: "/images/veg-soup.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 6,
        prepTime: 15,
        cookingTime: 30,
        difficulty: "Easy",
        cuisineType: "Comfort Food",
        likes: 198
    },
    {
        title: "Grilled Salmon",
        description: "Perfectly grilled salmon with lemon and herbs",
        ingredients: ["salmon fillet", "lemon", "herbs", "olive oil", "garlic"],
        instructions: "Season salmon, grill until cooked through, finish with lemon",
        image: "/images/salmon.jpg",
        videoUrl: "https://www.youtube.com/embed/example",
        servings: 2,
        prepTime: 10,
        cookingTime: 15,
        difficulty: "Easy",
        cuisineType: "Seafood",
        likes: 245
    }
];

// Connect, wipe old data, then insert fresh seed data.
const seedRecipes = async () => {
    try {
        // Prefer MONGO_URI from .env; fallback to local MongoDB.
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cookly");
        
        // Avoid duplicates by clearing old recipe records first.
        await Recipe.deleteMany({});
        console.log("Cleared existing recipes");
        
        // Bulk insert for faster setup.
        await Recipe.insertMany(recipes);
        console.log(`✓ Successfully seeded ${recipes.length} recipes`);
        
        // Exit success for terminal scripts.
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        // Exit failure so errors are visible in automation/CI.
        process.exit(1);
    }
};

// Run seeding immediately when this script is executed directly.
seedRecipes();
