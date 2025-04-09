import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { fetchArticlesByCategory, NYTArticle } from "../../api/nytApi";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "../../context/SearchContext";
import NewsCardSkeleton from "./NewsCardSkeleton";

const NewsList = ({
  range = "bottom",
  isMobile = false,
}: {
  range?: string;
  isMobile?: boolean;
}) => {
  const [articles, setArticles] = useState<NYTArticle[]>([]);
  const columnCount = range === "top" ? 2 : 3;
  const { debounced } = useSearch();

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

  const filtered = articles?.filter((article) =>
    article.title.toLowerCase().includes(debounced.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className={`news-grid news-skeleton columns-${columnCount}`}>
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
    <div className={`news-grid columns-${columnCount}`}>
      {filtered.map((article, index) => (
        <NewsCard key={index} article={article} />
      ))}
    </div>
  );
};

export default NewsList;
