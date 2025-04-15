import { useLocation } from "react-router-dom";
import { useSearchArticles } from "../hooks/useSearchArticles";
import { transformToNYTArticle } from "../utils/transformToNYTArticle";
import NewsCard from "./news/NewsCard";
import NewsCardSkeleton from "./news/NewsCardSkeleton";

const SearchResults = () => {
  const query = new URLSearchParams(useLocation().search);
  const searchTerm = query.get("q") || "";

  const {
    data: articles,
    isLoading,
    isFetching,
  } = useSearchArticles(searchTerm);

  if (isLoading || isFetching) {
    return (
      <div className="news-container news-skeleton">
        <h2>Your Bookmarked Articles</h2>
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
  if (!articles?.length) return <p>No results found for "{searchTerm}"</p>;

  const transformedArticles = articles?.map(transformToNYTArticle) || [];

  return (
    <div className="news-container search-results">
      <h2>Search results for "{searchTerm}"</h2>
      <ul className="article-list">
        {transformedArticles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
