import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="shell not-found-grid">
        <div className="not-found-copy">
          <p className="not-found-overline">MakeMoneyOrDie / 404</p>
          <h1>Page slipped through the cracks.</h1>
          <p>
            The link is broken, the page moved, or the internet decided to be dramatic. The
            archive and the front page are still here.
          </p>

          <div className="not-found-actions">
            <Link href="/" className="btn primary">
              Back Home
            </Link>
            <Link href="/articles" className="btn secondary">
              Browse Articles
            </Link>
          </div>

          <div className="not-found-stat">Lost pages are just unindexed opportunities.</div>
        </div>

        <aside className="not-found-panel" aria-label="404 panel">
          <p className="not-found-number">404</p>
          <div>
            <h2>The archive still works.</h2>
            <p>
              Try the latest essays, or go back to the landing page and start from the top.
            </p>
          </div>
          <div className="not-found-links">
            <Link href="/">
              <strong>Home</strong>
              <span>Return to the main page</span>
            </Link>
            <Link href="/articles">
              <strong>Articles</strong>
              <span>Open the full archive</span>
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}