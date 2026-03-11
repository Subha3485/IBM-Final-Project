# Cookly

Cookly is a Node.js + Express recipe sharing platform with EJS views, MongoDB persistence, recipe browsing, recipe detail pages, likes, and user authentication.

## Features

- Browse recipes on the home page with cuisine filters
- Open detailed recipe pages with ingredients, instructions, likes, and embedded video
- Sign up and log in with email/password
- OAuth-ready Google and Facebook auth routes
- Add recipes through authenticated API routes
- Fallback mock mode when MongoDB is unavailable
- Seed recipes from local data and web imports

## Tech Stack

- Node.js
- Express
- EJS
- MongoDB + Mongoose
- JWT
- Passport
- Express Session
- bcryptjs

## Current Project Structure

```text
config/
  db.js                 MongoDB connection logic
  passport.js           Passport OAuth configuration

controllers/
  recipeControllers.js  Recipe API handlers
  userControllers.js    User auth handlers

images/                 Brand assets and recipe images
icons/                  UI icons
middleware/             Custom middleware
models/                 Mongoose models
public/
  css/
    pages/              Page-specific CSS
    shared/             Shared/global CSS

routes/
  authRoutes.js         Google/Facebook OAuth routes
  recipeRoutes.js       Recipe routes
  userRoutes.js         User auth routes

scripts/                Data/image maintenance scripts
seeds/                  Seed/import scripts
utils/                  Utility modules
views/                  EJS pages

server.js               App entry point
package.json            Scripts and dependencies
```

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret
SESSION_SECRET=change_this_session_secret
PORT=5000
USE_MOCK_DATA=false
WEB_SEED_LIMIT=500

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
```

## Installation

```bash
npm install
```

## Run the App

Production-style start:

```bash
npm start
```

Development with auto-reload:

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

## Database Modes

### MongoDB Mode

Set:

```env
USE_MOCK_DATA=false
```

and provide a working `MONGO_URI`.

### Mock Mode

Set:

```env
USE_MOCK_DATA=true
```

In this mode the app skips MongoDB and falls back to built-in sample recipe data where supported.

## Authentication

### Email Auth

Working now:

- `POST /api/users/register`
- `POST /api/users/login`

Signup creates the user and login returns a JWT token.

### OAuth

Routes are wired for:

- `/auth/google`
- `/auth/google/callback`
- `/auth/facebook`
- `/auth/facebook/callback`

To use them, add real Google and Facebook app credentials to `.env`.

## API Endpoints

Base URL:

```text
http://localhost:5000
```

### User

- `POST /api/users/register`
- `POST /api/users/login`

### Recipes

- `GET /api/recipes`
- `GET /api/recipes/cuisines`
- `GET /api/recipes/:id`
- `POST /api/recipes`
- `POST /api/recipes/:id/like`

Query params for `GET /api/recipes`:

- `page`
- `limit`
- `cuisine`
- `fast`

## Pages

- `/` home page
- `/recipe/:id` recipe details
- `/login`
- `/signup`
- `/about`
- `/contact`
- `/create`

## Seed Commands

Seed starter recipes:

```bash
npm run seed
```

Import recipes from web source:

```bash
npm run seed:web
```

Seed Indian recipes:

```bash
npm run seed:indian
```

Seed must-have Indian recipes:

```bash
npm run seed:indian:must
```

## Utility Scripts

```bash
npm run fix:indian:images
npm run align:indian:images
npm run fix:missing:images
npm run fix:must:ingredients
npm run migrate:atlas
```

## Frontend Styling

CSS is now organized into:

- `public/css/shared/index.css` for shared layout and nav styles
- `public/css/pages/*.css` for page-specific styling

## Common Issues

### MongoDB auth failed

If you see:

```text
bad auth : authentication failed
```

then verify:

- Atlas database username/password
- Atlas network access rules
- `MONGO_URI` in `.env`

### App starts in mock mode

That means:

- `USE_MOCK_DATA=true`, or
- MongoDB connection failed

### OAuth button does not complete login

That means provider credentials are still missing or callback URLs do not match the app settings.

### Styles not loading

All CSS should now be served from:

```text
/css/pages/...
/css/shared/...
```

## Notes

- Main app startup is in `server.js`
- MongoDB connection logic is in `config/db.js`
- OAuth setup is in `config/passport.js`
- Recipe detail rendering is server-side through EJS
- Home page recipes and cuisines are loaded dynamically from the API
