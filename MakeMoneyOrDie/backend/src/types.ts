export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  tags: string[];
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
}

export interface GenerateArticleInput {
  topic: string;
  tags?: string[];
  tone?: "premium" | "technical" | "practical";
}

export interface GeneratedArticleDraft {
  title: string;
  excerpt: string;
  contentMarkdown: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}
