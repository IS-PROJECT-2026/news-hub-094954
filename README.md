# NewsHub

A full-stack news hub application with user authentication and full CRUD article management. Built with Vite + React on the frontend and Express + SQLite on the backend.

<a href="https://is-project-2026.github.io/news-hub-094954/" target="_blank"><b>Find My Project Here</b></a>

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete articles
- Articles are scoped to their author — only the owner can edit or delete their own articles
- Category filtering and sorting (latest, oldest, by author)
- Public article feed (no login required to browse/read)

## Tech Stack

**Frontend**
- React 19 + Vite
- CSS Modules for styling
- Context API for global auth/article state

**Backend**
- Node.js + Express
- SQLite (via `better-sqlite3`)
- JWT for authentication
- bcrypt for password hashing

## Project Structure
<img width="848" height="265" alt="Screenshot 2026-08-10 at 18 45 41" src="https://github.com/user-attachments/assets/1343e93b-0e01-425e-bf02-925d19f79e27" />


## Getting Started

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:


<img width="412" height="102" alt="Screenshot 2026-08-10 at 18 54 14" src="https://github.com/user-attachments/assets/f7658772-e7a9-476e-b7ca-d822b657b9d5" />

Start the backend:
```bash
npm run dev
```
The SQLite database (`server/db/news-hub.sqlite3`) is created automatically on first run.

### 2. Frontend setup

```bash
cd news-hub
npm install
cp .env.example .env
```

Edit `.env`:
VITE_API_URL=http://localhost:5000/api

Start the frontend:
```bash
npm run dev
```
The app runs at `http://localhost:5173`.

## API Reference

| Method | Route | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create a new account |
| POST | `/api/auth/login` | No | Log in, returns a JWT |
| GET | `/api/articles` | No | List all articles |
| GET | `/api/articles/:id` | No | Get a single article |
| POST | `/api/articles` | Yes | Create an article |
| PUT | `/api/articles/:id` | Yes (owner only) | Update an article |
| DELETE | `/api/articles/:id` | Yes (owner only) | Delete an article |

Authenticated requests need an `Authorization: Bearer <token>` header, using the token returned from `/api/auth/register` or `/api/auth/login`.

## Database Schema

**users**
| Column | Type |
|---|---|
| id | INTEGER PK |
| username | TEXT UNIQUE |
| email | TEXT UNIQUE |
| password_hash | TEXT |
| created_at | TEXT |

**articles**
| Column | Type |
|---|---|
| id | INTEGER PK |
| title | TEXT |
| content | TEXT |
| category | TEXT |
| author_id | INTEGER (FK → users.id) |
| created_at | TEXT |
| updated_at | TEXT |

## Scripts

**Backend** (`server/`)
| Command | Description |
|---|---|
| `npm run dev` | Start with auto-restart on file changes |
| `npm start` | Start normally |
| `npm run db:init` | Manually verify the database/schema |

**Frontend** (`news-hub/`)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |

## Environment Variables

**`server/.env`**
| Variable | Description |
|---|---|
| `PORT` | Backend port (default 5000) |
| `JWT_SECRET` | Secret used to sign auth tokens — keep this private |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin, used for CORS |

**`news-hub/.env`**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

Both `.env` files are gitignored — use the `.env.example` files as templates and never commit real secrets.
