import { Article, ArticlesResponse, SingleArticleResponse } from "./types";
import { publicEnv } from "./env";

function resolveApiUrl(): string {
  const internalApiUrl = process.env.INTERNAL_API_URL?.trim();

  if (typeof window === "undefined" && internalApiUrl) {
    return internalApiUrl;
  }

  return publicEnv.apiUrl;
}

function withQuery(url: string, query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value && value.trim()) {
      params.set(key, value.trim());
    }
  }

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export async function getArticles(search?: string, tag?: string): Promise<ArticlesResponse> {
  const endpoint = withQuery(`${resolveApiUrl()}/api/articles`, { search, tag });
  const response = await fetch(endpoint, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return (await response.json()) as ArticlesResponse;
}

export async function getArticleBySlug(slug: string): Promise<SingleArticleResponse | null> {
  const response = await fetch(`${resolveApiUrl()}/api/articles/${slug}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return (await response.json()) as SingleArticleResponse;
}

export async function getAllArticlesForStatic(): Promise<Article[]> {
  try {
    const data = await getArticles();
    return data.items;
  } catch {
    return [];
  }
}
