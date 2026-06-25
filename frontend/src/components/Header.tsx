import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          MakeMoneyOrDie
        </Link>
        <nav className="nav">
          <Link href="/articles">Articles</Link>
        </nav>
      </div>
    </header>
  );
}
