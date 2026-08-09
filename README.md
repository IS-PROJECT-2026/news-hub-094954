# NewsHub

A full-stack news hub application with user authentication and full CRUD article management. Built with Vite + React on the frontend and Express + SQLite on the backend.

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
news-hub/
├── src/ # Frontend
│ ├── components/ # Header, LoginModal, ArticleCard, ArticleModal, ArticleForm, Sidebar, Pagination, SkeletonCard
│ ├── context/ # AppContext — auth + article state
│ ├── hooks/ # useArticleFilters — search/category/sort/pagination
│ ├── services/ # authApi, articlesApi — talk to the backend
│ └── utils/ # helpers (date formatting, avatar colors)
└── server/ # Backend
├── db/ # schema.sql, connection.js, init.js
├── models/ # userModel, articleModel
├── controllers/ # authController, articleController
├── middleware/ # auth.js (JWT guard)
└── routes/ # authRoutes, articleRoutes

## Getting Started

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
PORT=5000
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

> **Note:** On macOS, port `5000` may be occupied by AirPlay Receiver (Control Center). If you get `EADDRINUSE`, either change `PORT` here (and the frontend's `VITE_API_URL` to match) or disable AirPlay Receiver in System Settings → General → AirDrop & Handoff.

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
