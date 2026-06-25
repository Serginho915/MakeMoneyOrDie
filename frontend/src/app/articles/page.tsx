import { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { SearchAndTagBar } from "@/components/SearchAndTagBar";
import { getArticles } from "@/lib/api";

export const metadata: Metadata = {
  title: "All Articles",
  description: "Browse all articles, search by topic, and filter by tags."
};

interface Props {
  searchParams: {
    search?: string;
    tag?: string;
  };
}

export default async function ArticlesPage({ searchParams }: Props) {
  const search = searchParams.search || "";
  const tag = searchParams.tag || "";
  const { items, total, tags } = await getArticles(search, tag);

  return (
    <section className="section">
      <div className="shell">
        <h1 className="page-title">All Articles</h1>
        <p>Found {total} matching stories.</p>

        <SearchAndTagBar tags={tags} initialSearch={search} initialTag={tag} />

        <div className="article-grid">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
