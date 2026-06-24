import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types";

interface Props {
  article: Article;
}

export function ArticleCard({ article }: Props) {
  return (
    <article className="article-card">
      <Link href={`/articles/${article.slug}`} className="image-wrap">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            width={800}
            height={500}
            className="cover"
          />
        ) : (
          <div className="cover cover-placeholder">
            <span>Upload a local image to backend/media</span>
          </div>
        )}
      </Link>
      <div className="card-body">
        <div className="tag-row">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <h3>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
      </div>
    </article>
  );
}
