import db from "../db/connection.js";

export const ArticleModel = {
  create({ title, content, category, imageUrl, authorId }) {
    const stmt = db.prepare(
      `INSERT INTO articles (title, content, category, image_url, author_id)
       VALUES (?, ?, ?, ?, ?)`
    );
    const result = stmt.run(title, content, category || "general", imageUrl || null, authorId);
    return this.findById(result.lastInsertRowid);
  },

  findAll() {
    return db
      .prepare(
        `SELECT articles.*, users.username AS author_name
         FROM articles
         JOIN users ON users.id = articles.author_id
         ORDER BY articles.created_at DESC`
      )
      .all();
  },

  findById(id) {
    return db
      .prepare(
        `SELECT articles.*, users.username AS author_name
         FROM articles
         JOIN users ON users.id = articles.author_id
         WHERE articles.id = ?`
      )
      .get(id);
  },

  update(id, { title, content, category, imageUrl }) {
    db.prepare(
      `UPDATE articles
       SET title = ?, content = ?, category = ?, image_url = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(title, content, category, imageUrl || null, id);
    return this.findById(id);
  },

  remove(id) {
    const result = db.prepare(`DELETE FROM articles WHERE id = ?`).run(id);
    return result.changes > 0;
  },
};
