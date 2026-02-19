# Cookly Recipe Database Setup

## Quick Start with Mock Data
The app is currently running with **mock data**. Recipes load fast using sample data.

## Upgrade to MongoDB Database

### Step 1: Install MongoDB Locally
**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install and run MongoDB Service
- By default runs on `mongodb://localhost:27017`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Step 2: Configure MongoDB URI
Update `.env` file in the project root:
```
MONGO_URI=mongodb://localhost:27017/cookly
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

For **MongoDB Atlas** (Cloud):
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cookly?retryWrites=true&w=majority
```

### Step 3: Seed the Database with Recipes
Run the seed script to populate 20 recipes:
```bash
npm run seed
```

Or import many recipes directly from the web (TheMealDB):
```bash
npm run seed:web
```

You should see:
```
✓ Successfully seeded 20 recipes
```

### Step 4: Restart the Server
```bash
npm start
```

Server will now output:
```
✓ MongoDB Connected Successfully!
Server running on port 5000
```

## Features
- ✅ **20+ Recipes** in database
- ✅ **Pagination** - 12 recipes per page for fast loading
- ✅ **Database Indexing** - Optimized queries by likes, difficulty, cuisine type
- ✅ **Lean Queries** - Returns only needed fields, faster data transfer
- ✅ **Fallback Mode** - Falls back to mock data if MongoDB unavailable

## Performance Improvements
- Database indexes on: `title`, `difficulty`, `cuisineType`, `likes`
- Compound indexes for sorting by popularity
- Pagination reduces data per request
- Lean queries exclude unnecessary fields like user reference data

## Current Status
- 🟡 Running in **Mock Mode** (fast, but no persistence)
- Set up MongoDB above to enable data persistence
