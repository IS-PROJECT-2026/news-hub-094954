import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SQLite file lives in server/db/news-hub.sqlite3
// Keeping it inside db/ makes it easy to .gitignore in one place.
const DB_PATH = path.join(__dirname, "news-hub.sqlite3");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const db = new Database(DB_PATH);

// Recommended pragmas for a small Node app talking to SQLite
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Apply schema on every boot — CREATE TABLE IF NOT EXISTS makes this safe
const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
db.exec(schema);

// Lightweight migration: CREATE TABLE IF NOT EXISTS only applies to brand-new
// databases, so an already-existing news-hub.sqlite3 won't pick up new
// columns automatically. Add them here if missing.
const articleColumns = db.prepare(`PRAGMA table_info(articles)`).all();
const hasImageUrl = articleColumns.some((col) => col.name === "image_url");
if (!hasImageUrl) {
  db.exec(`ALTER TABLE articles ADD COLUMN image_url TEXT`);
}

export default db;
