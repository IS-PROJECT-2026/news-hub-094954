// Run manually with: npm run db:init
// Useful for confirming the schema applies cleanly, or after deleting
// news-hub.sqlite3 to start fresh.
import db from "./connection.js";

console.log("Database initialized at:", db.name);
console.log(
  "Tables:",
  db
    .prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all()
    .map((row) => row.name)
);

db.close();
