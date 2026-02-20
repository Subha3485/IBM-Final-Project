# Cookly (IBM Final Project)

Cookly is a Node.js + Express recipe app with EJS views.
It supports:
- public recipe browsing
- recipe details pages
- user signup/login with JWT
- adding recipes (authenticated route)
- like/unlike recipes (works for signed-in and anonymous users)

The app can run in two modes:
- MongoDB mode: data is stored in MongoDB.
- Mock mode: app uses built-in sample recipes when DB is not available.

## Tech Stack
- Node.js
- Express
- EJS
- MongoDB + Mongoose
- JWT + bcrypt

## Project Structure

```text
config/          Database connection
controllers/     Request handlers
middleware/      Auth middleware
models/          Mongoose models
routes/          API route definitions
seeds/           Seed scripts
scripts/         Data/image utility scripts
views/           EJS pages
images/          Recipe and UI images
icons/           Icon assets
server.js        App entry point
```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` in the project root:
```env
PORT=5000
JWT_SECRET=your_secret_key
MONGO_URI=mongodb://localhost:27017/cookly
USE_MOCK_DATA=false
```

3. Start server:
```bash
npm start
```

4. Open in browser:
```text
http://localhost:5000
```

## Mock Mode (No MongoDB)

If you want to run without MongoDB, set:

```env
USE_MOCK_DATA=true
```

You can also leave `USE_MOCK_DATA=false`; if MongoDB is unavailable, recipe APIs still fall back to mock recipes.

## Seed Database

Load initial data when MongoDB is connected:

```bash
npm run seed
```

Other seed/import commands:

```bash
npm run seed:web
npm run seed:indian
npm run seed:indian:must
```

## Useful Scripts

```bash
npm run dev
npm run fix:indian:images
npm run align:indian:images
npm run fix:missing:images
npm run fix:must:ingredients
npm run migrate:atlas
```

## API Endpoints

Base URL: `http://localhost:5000`

### User
- `POST /api/users/register`
- `POST /api/users/login`

### Recipes
- `GET /api/recipes`
  - Query params: `page`, `limit`, `cuisine`, `fast`
- `GET /api/recipes/cuisines`
- `GET /api/recipes/:id`
- `POST /api/recipes` (requires auth token)
- `POST /api/recipes/:id/like`

## Auth Notes

Use login response token as:

```text
Authorization: Bearer <token>
```

`POST /api/recipes` requires this token.

## Pages

- `/` home
- `/recipe/:id` recipe details
- `/login`
- `/signup`
- `/about`
- `/contact`
- `/create`

## Common Issues

- Server exits at startup:
  - check `.env` values.
  - if MongoDB is not running, use `USE_MOCK_DATA=true`.
  - for deployment, set one of `MONGO_URI`, `MONGODB_URI`, or `MONGO_URI_ATLAS`.

- Recipe not found:
  - verify the ID exists in DB or in mock data.

- Auth errors on protected routes:
  - ensure `JWT_SECRET` is set and token is sent in `Authorization` header.

## Notes for Teammates

- Main backend flow starts in `server.js`.
- API logic is in `controllers/recipeControllers.js` and `controllers/userControllers.js`.
- Route mapping is in `routes/recipeRoutes.js` and `routes/userRoutes.js`.
- DB connection logic is in `config/db.js`.
