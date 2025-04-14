import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { fetchArticlesByCategory } from "../../api/nytApi";
import { useQuery } from "@tanstack/react-query";
import NewsCardSkeleton from "./NewsCardSkeleton";
import { NYTArticle } from "../../types";
import { useIsMobile } from "../../hooks/useIsMobile";

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

  // const filtered = articles?.filter((article) =>
  //   article.title.toLowerCase().includes(debounced.toLowerCase())
  // );

  // const filtered =
  //   isSearching && debounced
  //     ? articles?.filter((article) =>
  //         article.title.toLowerCase().includes(debounced.toLowerCase())
  //       )
  //     : articles;

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
      {articles.map((article, index) => (
        <NewsCard key={index} article={article} />
      ))}
    </div>
  );
};

export default NewsList;
