import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { fetchArticlesByCategory, NYTArticle } from "../../api/nytApi";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "../../context/SearchContext";

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
    queryFn: () => fetchArticlesByCategory("world"),
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
    return <p>Loading latest news...</p>;
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
