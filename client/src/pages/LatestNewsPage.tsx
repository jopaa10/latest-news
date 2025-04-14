import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLatestArticles } from "../api/nytApi";
import NewsCard from "../components/news/NewsCard";
import { useEffect, useRef } from "react";
import NewsCardSkeleton from "../components/news/NewsCardSkeleton";

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
    refetchInterval: 600000,
    staleTime: 60 * 1000,
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
        scrollTop + windowHeight >= fullHeight - 200 &&
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

      {isLoading && (
        <ul className="article-list news-skeleton">
          {[...Array(6)].map((index) => (
            <li key={index} className="article-list__item">
              <NewsCardSkeleton key={index} />
            </li>
          ))}
        </ul>
      )}
      {isError && <p>Error loading news.</p>}

      <ul className="article-list">
        {allArticles.map((article, index) => (
          <li key={index} className="article-list__item">
            <NewsCard key={index} article={article} isLatest={true} />
          </li>
        ))}
      </ul>
      {isFetchingNextPage && <p className="loading">Loading more...</p>}
    </div>
  );
};

export default LatestNews;
