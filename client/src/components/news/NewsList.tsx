import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { fetchArticlesByCategory } from "../../api/nytApi";
import { useQuery } from "@tanstack/react-query";
import NewsCardSkeleton from "./NewsCardSkeleton";
import { NYTArticle } from "../../types";
import { useIsMobile } from "../../hooks/useIsMobile";
import LatestNewsWidget from "./LatestNewsWidget";

const NewsList = ({ range = "bottom" }: { range?: string }) => {
  const [articles, setArticles] = useState<NYTArticle[]>([]);
  const columnCount = range === "top" ? 2 : 3;
  const isMobile = useIsMobile();

  const {
    data: allArticles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticlesByCategory("home"),
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

  if (isLoading) {
    return (
      <div className={`news-flex news-skeleton columns-${columnCount}`}>
        {[...Array(isMobile ? 3 : 6)].map((_, index) => (
          <NewsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p>Error while loading news...</p>;
  }

  return (
    <>
      {!isMobile && range === "top" && (
        <div className="top-flex-wrapper">
          <ul className="top-news-cards article-list">
            {articles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </ul>

          <LatestNewsWidget />
        </div>
      )}

      <ul className="news-flex article-list">
        {articles.slice(range === "top" ? 4 : 0).map((article) => (
          <NewsCard article={article} />
        ))}
      </ul>
    </>
  );
};

export default NewsList;
