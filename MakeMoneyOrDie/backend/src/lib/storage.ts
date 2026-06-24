import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "../config";
import { Article } from "../types";

function resolveDbPath(): string {
  if (path.isAbsolute(config.articlesDbPath)) {
    return config.articlesDbPath;
  }

  return path.resolve(process.cwd(), config.articlesDbPath);
}

const dbPath = resolveDbPath();

async function ensureFile(): Promise<void> {
  const dir = path.dirname(dbPath);
  await mkdir(dir, { recursive: true });

  try {
    await readFile(dbPath, "utf-8");
  } catch {
    await writeFile(dbPath, "[]", "utf-8");
  }
}

export async function getAllArticles(): Promise<Article[]> {
  await ensureFile();
  const raw = await readFile(dbPath, "utf-8");
  const parsed = JSON.parse(raw) as Article[];

  return parsed.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function saveAllArticles(articles: Article[]): Promise<void> {
  await ensureFile();
  await writeFile(dbPath, JSON.stringify(articles, null, 2), "utf-8");
}

export async function addArticle(article: Article): Promise<Article> {
  const articles = await getAllArticles();
  const next = [article, ...articles];
  await saveAllArticles(next);

  return article;
}

export async function findArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getAllArticles();
  return articles.find((article) => article.slug === slug);
}
