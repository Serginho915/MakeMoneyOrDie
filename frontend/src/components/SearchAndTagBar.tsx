"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  tags: string[];
  initialSearch: string;
  initialTag: string;
}

export function SearchAndTagBar({ tags, initialSearch, initialTag }: Props) {
  const [search, setSearch] = useState(initialSearch);
  const [activeTag, setActiveTag] = useState(initialTag);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSearch(initialSearch);
    setActiveTag(initialTag);
  }, [initialSearch, initialTag]);

  function applyFilters(nextSearch: string, nextTag: string) {
    const nextParams = new URLSearchParams();

    if (nextSearch.trim()) {
      nextParams.set("search", nextSearch.trim());
    }

    if (nextTag.trim()) {
      nextParams.set("tag", nextTag.trim());
    }

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <section className="filters">
      <div className="search-input-wrap">
        <input
          type="search"
          placeholder="Search by headline, excerpt, topic"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              applyFilters(search, activeTag);
            }
          }}
        />
        <button onClick={() => applyFilters(search, activeTag)}>Search</button>
      </div>

      <div className="tag-filter">
        <button
          className={!activeTag ? "active" : ""}
          onClick={() => {
            setActiveTag("");
            applyFilters(search, "");
          }}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            className={activeTag === tag ? "active" : ""}
            onClick={() => {
              const nextTag = activeTag === tag ? "" : tag;
              setActiveTag(nextTag);
              applyFilters(search, nextTag);
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
