import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";

const router = Router();

// Public reads
router.get("/", getArticles);
router.get("/:id", getArticle);

// Auth required to write
router.post("/", requireAuth, createArticle);
router.put("/:id", requireAuth, updateArticle);
router.delete("/:id", requireAuth, deleteArticle);

export default router;
