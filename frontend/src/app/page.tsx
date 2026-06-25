import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { getArticles } from "@/lib/api";

export default async function HomePage() {
  const { items } = await getArticles();
  const featured = items.slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="hero-overline">Andrew Nicklson / MakeMoneyOrDie</p>
            <h1>Build leverage before the rent reminder does it for you.</h1>
            <p>
              Sharp essays on money, attention, and the uncomfortable math of making your own
              future. No fluff, no startup cosplay, just ideas that actually survive contact with
              a calendar and a bank account.
            </p>
            <div className="cta-row">
              <Link href="/articles" className="btn primary">
                Enter The Archive
              </Link>
            </div>
            <div className="newsletter-block">
              <p className="newsletter-kicker">Weekly money signal</p>
              <NewsletterSignup />
            </div>
            <div className="hero-tags">
              <span>Side Hustles</span>
              <span>Behavioral Economics</span>
              <span>Digital Products</span>
              <span>Attention Strategy</span>
            </div>
          </div>
          <aside className="hero-panel">
            <div className="hero-panel-top">
              <span className="hero-panel-label">Issue of the week</span>
              <h2>Money loves structure more than motivation.</h2>
            </div>
            <ul className="hero-points">
              <li>Read what matters, not what looks impressive in a screenshot.</li>
              <li>Turn skills into offers that people understand in ten seconds.</li>
              <li>Build assets that keep working after your mood leaves the room.</li>
            </ul>
            <div className="hero-quote">
              <p>
                “The internet did not create new opportunities. It removed the receptionist.”
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <h2>Latest Stories</h2>
            <Link href="/articles" className="btn secondary">
              View All
            </Link>
          </div>
          <div className="article-grid">
            {featured.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
