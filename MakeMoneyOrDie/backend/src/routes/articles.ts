import { Router } from "express";
import { findArticleBySlug, getAllArticles } from "../lib/storage";

const router = Router();

router.get("/", async (req, res) => {
  const search = String(req.query.search || "").toLowerCase().trim();
  const tag = String(req.query.tag || "").toLowerCase().trim();

  const articles = await getAllArticles();

  const filtered = articles.filter((article) => {
    const matchesSearch =
      !search ||
      article.title.toLowerCase().includes(search) ||
      article.excerpt.toLowerCase().includes(search) ||
      article.contentMarkdown.toLowerCase().includes(search);

    const matchesTag =
      !tag || article.tags.some((articleTag) => articleTag.toLowerCase() === tag);

    return matchesSearch && matchesTag;
  });

  res.json({
    items: filtered,
    total: filtered.length,
    tags: [...new Set(articles.flatMap((article) => article.tags))].sort()
  });
});

router.get("/:slug", async (req, res) => {
  const article = await findArticleBySlug(req.params.slug);

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  const allArticles = await getAllArticles();
  const related = allArticles
    .filter((item) => item.slug !== article.slug)
    .map((item) => {
      const overlap = item.tags.filter((tag) => article.tags.includes(tag)).length;
      return { item, overlap };
    })
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((entry) => entry.item);

  res.json({ article, related });
});

export default router;
