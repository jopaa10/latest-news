import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLatestArticles } from "../api/nytApi";
import NewsCard from "../components/news/NewsCard";
import { useEffect, useRef } from "react";

const LatestNews = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["latestArticles"],
    queryFn: ({ pageParam = 0 }) => fetchLatestArticles({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (
        scrollTop + windowHeight >= fullHeight - 200 && // near bottom
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allArticles = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="all-latest-news" ref={containerRef}>
      <h2>All Latest News</h2>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading news.</p>}

      <ul className="article-list">
        {allArticles.map((article, index) => (
          <li className="article-list__item">
            <NewsCard key={index} article={article} />
          </li>
        ))}
      </ul>
      {isFetchingNextPage && <p className="loading">Loading more...</p>}
    </div>
  );
};

export default LatestNews;
