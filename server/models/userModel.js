import db from "../db/connection.js";

export const UserModel = {
  create({ username, email, passwordHash }) {
    const stmt = db.prepare(
      `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`
    );
    const result = stmt.run(username, email, passwordHash);
    return this.findById(result.lastInsertRowid);
  },

  findByEmail(email) {
    return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  },

  findById(id) {
    return db
      .prepare(`SELECT id, username, email, created_at FROM users WHERE id = ?`)
      .get(id);
  },
};
