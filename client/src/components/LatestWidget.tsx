import "../styles/latestNews.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowRight } from "../assets/icons";
import { fetchLatestArticles, NYTArticle } from "../api/nytApi";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LatestNewsSkeleton from "./news/LatestNewsSkeleton";
import { slugify } from "../utils/createSlug";

const LIMIT = 10;

const LatestNewsWidget = () => {
  const navigate = useNavigate();

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
    getNextPageParam: (lastPage) => {
      return lastPage.nextOffset ?? undefined;
    },
    initialPageParam: 0,
    refetchInterval: 600000,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

      const bottomOffset = 100;

      const isNearBottom =
        scrollHeight - scrollTop - clientHeight < bottomOffset;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <aside className="latest-news-widget">
      <div className="widget-header">
        <span className="dot"></span>
        <h4>Latest news</h4>
      </div>

      <div className="news-scroll" ref={scrollRef}>
        {isLoading && (
          <div className="news-skeleton">
            {[...Array(LIMIT)].map((_, index) => (
              <LatestNewsSkeleton key={index} />
            ))}
          </div>
        )}
        {isError && <p>Error loading latest news.</p>}

        {data?.pages.map((page) => (
          <>
            {page.results
              .slice(0, LIMIT)
              .map((item: NYTArticle, index: number) => (
                <div
                  key={index}
                  className="news-item"
                  role="button"
                  onClick={() =>
                    navigate(
                      `/${item.section.toLowerCase()}/article/${slugify(
                        item.title
                      )}`
                    )
                  }
                >
                  <span className="time">
                    {new Date(item.published_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <p className="title">{item.title}</p>
                </div>
              ))}
          </>
        ))}

        {isFetchingNextPage && (
          <div className="loading">
            <div className="loading__icon"></div>
          </div>
        )}
      </div>

      <a className="see-all" onClick={() => navigate("/see-all-news")}>
        See all news
        <span>
          <ArrowRight />
        </span>
      </a>
    </aside>
  );
};

export default LatestNewsWidget;
