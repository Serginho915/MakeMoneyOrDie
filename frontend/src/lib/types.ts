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

export interface ArticlesResponse {
  items: Article[];
  total: number;
  tags: string[];
}

export interface SingleArticleResponse {
  article: Article;
  related: Article[];
}
