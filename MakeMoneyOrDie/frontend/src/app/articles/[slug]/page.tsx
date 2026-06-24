import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticleBySlug } from "@/lib/api";
import { publicEnv } from "@/lib/env";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getArticleBySlug(params.slug);

  if (!data) {
    return {
      title: "Article Not Found"
    };
  }

  return {
    title: data.article.seoTitle || data.article.title,
    description: data.article.seoDescription || data.article.excerpt,
    openGraph: {
      type: "article",
      title: data.article.seoTitle || data.article.title,
      description: data.article.seoDescription || data.article.excerpt,
      images: [data.article.coverImage]
    }
  };
}

export default async function ArticlePage({ params }: Props) {
  const data = await getArticleBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { article, related } = data;
  const articleUrl = `${publicEnv.siteUrl}/articles/${article.slug}`;
  const shareText = `${article.title} - ${article.excerpt}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedText = encodeURIComponent(shareText);
  const shareLinks = [
    {
      label: "X",
      href: `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
        </svg>
      )
    },
    {
      label: "Threads",
      href: `https://www.threads.net/intent/post?text=${encodeURIComponent(`${shareText}\n${articleUrl}`)}`,
      icon: (
        <svg viewBox="0 0 192 192" aria-hidden="true" fill="currentColor">
          <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
        </svg>
      )
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      )
    }
  ];

  return (
    <div className="shell">
      <header className="article-hero">
        <div className="tag-row">
          {article.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
        <h1>{article.title}</h1>
        <p className="author-line">By Andrew Nicklson</p>
        <p>{article.excerpt}</p>
        <div className="share-row" aria-label="Share article">
          <span className="share-label">Share</span>
          <div className="share-links">
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Share on ${link.label}`}
                title={`Share on ${link.label}`}
              >
                <span className="share-icon">{link.icon}</span>
                <span className="sr-only">{`Share on ${link.label}`}</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="article-cover">
        {article.coverImage ? (
          <Image src={article.coverImage} alt={article.title} width={1600} height={900} />
        ) : (
          <div className="article-cover-placeholder">
            <span>Upload a local image to backend/media</span>
          </div>
        )}
      </div>

      <article className="markdown">
        <ReactMarkdown>{article.contentMarkdown}</ReactMarkdown>
      </article>

      <section className="section">
        <h2>Related Articles</h2>
        <div className="article-grid">
          {related.length ? (
            related.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))
          ) : (
            <p>No related articles yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
