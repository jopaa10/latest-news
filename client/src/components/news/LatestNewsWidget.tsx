import "../../styles/latestNews.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowRight } from "../../assets/icons";
import { fetchLatestArticles } from "../../api/nytApi";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LatestNewsSkeleton from "./LatestNewsSkeleton";
import { slugify } from "../../utils/createSlug";
import { NYTArticle } from "../../types/newsTypes";

const LIMIT = 25;

const LatestNewsWidget = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["latestArticles"],
    queryFn: ({ pageParam = 0 }) => fetchLatestArticles({ pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.nextOffset ?? undefined;
    },
    initialPageParam: 0,
    refetchInterval: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    retry: (count, error: unknown) =>
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 429 &&
      count < 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const navigateToArticle = (article: NYTArticle) => {
    navigate(
      `/${article.section.toLowerCase()}/article/${slugify(article.title)}`
    );
  };

  return (
    <div className="latest-news-widget">
      <div className="widget-header">
        <span className="dot" aria-hidden="true"></span>
        <h2 className="title-medium"> Latest news </h2>
      </div>

      <div
        className="news-scroll"
        role="region"
        aria-labelledby="latest-news-heading"
        ref={scrollRef}
      >
        {(isLoading || isFetching) && (
          <div className="news-skeleton" aria-busy="true" aria-live="polite">
            {[...Array(LIMIT)].map((_, index) => (
              <LatestNewsSkeleton key={index} />
            ))}
          </div>
        )}
        {isError && <p role="alert">Error loading latest news.</p>}

        <ul className="news-list">
          {data?.pages.map((page, pageIndex) => (
            <li key={`page-${pageIndex}`}>
              {page.results
                .slice(0, LIMIT)
                .map((item: NYTArticle, index: number) => (
                  <button
                    key={index}
                    className="news-item"
                    onClick={() => navigateToArticle(item)}
                    onKeyDown={(e) => {
                      if (["Enter", " "].includes(e.key)) {
                        e.preventDefault();
                        navigateToArticle(item);
                      }
                    }}
                    aria-label={`Read article: ${item.title}`}
                  >
                    <span className="time">
                      {new Date(item.published_date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <h2 className="title-medium">{item.title}</h2>
                  </button>
                ))}
            </li>
          ))}
        </ul>

        {isFetchingNextPage && (
          <div className="loading" aria-busy="true" aria-live="polite">
            <div
              className="loading__icon"
              role="status"
              aria-label="Loading more articles"
            ></div>
          </div>
        )}
      </div>

      <button
        className="see-all title-medium"
        onClick={() => navigate("/see-all-news")}
        aria-label="See all latest news articles"
      >
        See all news
        <span aria-hidden="true">
          <ArrowRight />
        </span>
      </button>
    </div>
  );
};

export default LatestNewsWidget;
