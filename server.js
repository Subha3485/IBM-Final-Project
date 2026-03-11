// Core dependencies and local modules.
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const connectDB = require("./config/db");
const Recipe = require("./models/Recipe");
const { passport, configurePassport } = require("./config/passport");

// Load environment variables from .env and initialize DB connection.
dotenv.config();
configurePassport();

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const mongoUri =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URI_ATLAS ||
  null;

if (isProduction) {
  app.set("trust proxy", 1);
}

// Configure server-side rendering with EJS templates.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse JSON request bodies and serve static assets from project root.
app.use(cors());
app.use(express.json());
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use(express.static(path.join(__dirname)));

const sessionConfig = {
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "cookly-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: isProduction ? "lax" : "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

if (mongoUri && process.env.USE_MOCK_DATA !== "true") {
  sessionConfig.store = MongoStore.create({
    mongoUrl: mongoUri,
    collectionName: "sessions",
    ttl: 60 * 60 * 24 * 7,
    autoRemove: "native",
  });
} else if (isProduction) {
  console.warn("Mongo-backed session store is not configured. Sessions may not persist in production.");
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Mount REST API route modules.
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/auth", require("./routes/authRoutes"));

// Render the home page.
app.get("/", (req, res) => {
  res.render("home");
});

// Render a single recipe details page (MongoDB first, then API fallback).
app.get("/recipe/:id", async (req, res) => {
  const recipeId = req.params.id;

  try {
    // Query Mongo when request id is an ObjectId.
    if (mongoose.Types.ObjectId.isValid(recipeId)) {
      const mongoRecipe = await Recipe.findById(recipeId).lean();
      if (mongoRecipe) {
        mongoRecipe.id = mongoRecipe._id.toString();
        return res.render("recipe", { recipe: mongoRecipe });
      }
    }

    // Fallback to API route (which already supports mock-mode data).
    const apiRecipe = await new Promise((resolve, reject) => {
      const apiPath = `/api/recipes/${encodeURIComponent(recipeId)}`;
      const reqApi = http.get(
        { host: "localhost", port: process.env.PORT || 5000, path: apiPath },
        (apiRes) => {
          let raw = "";
          apiRes.on("data", (chunk) => {
            raw += chunk;
          });
          apiRes.on("end", () => {
            if (apiRes.statusCode !== 200) return reject(new Error("Recipe not found"));
            try {
              resolve(JSON.parse(raw));
            } catch (err) {
              reject(err);
            }
          });
        }
      );
      reqApi.on("error", reject);
    });

    return res.render("recipe", { recipe: apiRecipe });
  } catch (error) {
    return res.status(404).render("404", { message: "Recipe not found" });
  }
});

// Render authentication and informational pages.
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/create", (req, res) => {
  res.render("create");
});

// Start server only after DB connection succeeds.
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.warn("Starting server without MongoDB. Mock/fallback data paths are active.");
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
