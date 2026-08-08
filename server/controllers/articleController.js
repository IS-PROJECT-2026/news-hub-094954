import { ArticleModel } from "../models/articleModel.js";

export function getArticles(req, res) {
  res.json(ArticleModel.findAll());
}

export function getArticle(req, res) {
  const article = ArticleModel.findById(req.params.id);
  if (!article) return res.status(404).json({ error: "Article not found" });
  res.json(article);
}

export function createArticle(req, res) {
  const { title, content, category, image_url } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "title and content are required" });
  }

  const article = ArticleModel.create({
    title,
    content,
    category,
    imageUrl: image_url,
    authorId: req.user.id,
  });
  res.status(201).json(article);
}

export function updateArticle(req, res) {
  const existing = ArticleModel.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Article not found" });

  if (existing.author_id !== req.user.id) {
    return res.status(403).json({ error: "You can only edit your own articles" });
  }

  const { title, content, category, image_url } = req.body;
  const updated = ArticleModel.update(req.params.id, {
    title: title ?? existing.title,
    content: content ?? existing.content,
    category: category ?? existing.category,
    imageUrl: image_url ?? existing.image_url,
  });
  res.json(updated);
}

export function deleteArticle(req, res) {
  const existing = ArticleModel.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Article not found" });

  if (existing.author_id !== req.user.id) {
    return res.status(403).json({ error: "You can only delete your own articles" });
  }

  ArticleModel.remove(req.params.id);
  res.status(204).send();
}
