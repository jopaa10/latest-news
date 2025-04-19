import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLatestArticles } from "../api/nytApi";
import { useEffect, useRef } from "react";
import NewsList from "../components/news/NewsList";
import Title from "../components/common/Title";

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
    refetchInterval: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    retry: (count, error: unknown) => {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 429
      ) {
        return count < 3;
      }
      return false;
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
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
      <Title text="All Latest News" />
      {isError && <p>Error loading news.</p>}

      <NewsList articles={allArticles} isLoading={isLoading} />
      {isFetchingNextPage && (
        <p className="loading" role="status" aria-live="polite">
          Loading more...
        </p>
      )}
    </div>
  );
};

export default LatestNews;
