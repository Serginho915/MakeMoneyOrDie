import { randomUUID } from "node:crypto";
import { config } from "../config";
import { addArticle, getAllArticles } from "./storage";
import { generateArticleWithOpenRouter } from "./openrouter";
import { ensureUniqueSlug, slugify } from "./slug";
import { pickRandomMediaImageUrl } from "./media";
import { Article, GenerateArticleInput } from "../types";

export async function generateAndStoreArticle(input: GenerateArticleInput): Promise<Article> {
  const draft = await generateArticleWithOpenRouter(input);
  const allArticles = await getAllArticles();
  const slug = ensureUniqueSlug(
    slugify(draft.title),
    new Set(allArticles.map((article) => article.slug))
  );

  const article: Article = {
    id: randomUUID(),
    slug,
    title: draft.title,
    excerpt: draft.excerpt,
    contentMarkdown: draft.contentMarkdown,
    tags: draft.tags,
    coverImage: await pickRandomMediaImageUrl(),
    seoTitle: draft.seoTitle,
    seoDescription: draft.seoDescription,
    createdAt: new Date().toISOString()
  };

  await addArticle(article);
  return article;
}

export function getAutoPostTopics(): string[] {
  return config.autoPostTopics;
}
