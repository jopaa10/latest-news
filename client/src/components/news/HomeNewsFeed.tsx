import { useEffect, useState } from "react";
import { fetchArticlesByCategory } from "../../api/nytApi";
import { useQuery } from "@tanstack/react-query";
import { NYTArticle } from "../../types/newsTypes";
import { useIsMobile } from "../../hooks/useIsMobile";
import LatestNewsWidget from "./LatestNewsWidget";
import NewsList from "./NewsList";

const HomeNewsFeed = ({ range = "bottom" }: { range?: string }) => {
  const [articles, setArticles] = useState<NYTArticle[]>([]);
  const isMobile = useIsMobile();

  const {
    data: allArticles,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticlesByCategory("home"),
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!allArticles) return;

    if (!isMobile) {
      const selected =
        range === "top" ? allArticles.slice(0, 4) : allArticles.slice(4);
      setArticles(selected);
    } else {
      setArticles(allArticles);
    }
  }, [allArticles, range, isMobile]);

  if (isLoading || isFetching) {
    return <NewsList articles={[]} isFetching={true} isLoading={true} />;
  }

  if (isError) {
    return (
      <section aria-live="assertive" role="alert">
        <p>Error while loading news.</p>
      </section>
    );
  }

  return (
    <>
      {!isMobile && range === "top" && (
        <section
          className="top-flex-wrapper"
          role="region"
          aria-label="Top news section"
        >
          <NewsList articles={articles} cls="top-news-cards" />
          <LatestNewsWidget />
        </section>
      )}
      <section
        role="region"
        aria-label={
          !isMobile && range === "top"
            ? "Additional news articles"
            : "News articles"
        }
      >
        <NewsList
          articles={articles.slice(range === "top" ? 4 : 0)}
          cls="news-flex"
        />
      </section>
    </>
  );
};

export default HomeNewsFeed;
