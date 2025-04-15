import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchArticlesByCategory } from "../api/nytApi";
import NewsCard from "../components/news/NewsCard";
import "../styles/categoryPage.scss";
import { useSearch } from "../context/SearchContext";
import NewsCardSkeleton from "../components/news/NewsCardSkeleton";
import { NYTArticle } from "../types";

const CategoryPage = () => {
  const { category = "world" } = useParams();
  const { debounced } = useSearch();

  const {
    data: articles = [],
    isLoading,
    isError,
  } = useQuery<NYTArticle[]>({
    queryKey: ["articles", category],
    queryFn: () => fetchArticlesByCategory(category),
    staleTime: 1000 * 60 * 5,
  });

  const filtered = articles?.filter((article) =>
    article.title.toLowerCase().includes(debounced.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="news-container news-skeleton">
        <h2>{category} news</h2>
        <ul className="article-list">
          {[...Array(6)].map((_, index) => (
            <li key={index} className="article-list__item">
              <NewsCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (isError) return <p>Something went wrong while fetching articles 😢</p>;

  return (
    <div className="news-container">
      <h2>{category} news</h2>
      {filtered.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul className="article-list">
          {filtered.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryPage;
