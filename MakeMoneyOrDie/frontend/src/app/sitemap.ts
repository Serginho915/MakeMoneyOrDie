import { MetadataRoute } from "next";
import { getAllArticlesForStatic } from "@/lib/api";
import { publicEnv } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.siteUrl;
  const articles = await getAllArticlesForStatic();

  return [
    {
      url: `${base}/`,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${base}/articles`,
      changeFrequency: "daily",
      priority: 0.9
    },
    ...articles.map((article) => ({
      url: `${base}/articles/${article.slug}`,
      lastModified: article.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.85
    }))
  ];
}
