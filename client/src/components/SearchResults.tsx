import { useLocation } from "react-router-dom";
import { useSearchArticles } from "../hooks/useSearchArticles";
import { transformToNYTArticle } from "../utils/transformToNYTArticle";
import NewsList from "./news/NewsList";
import Title from "./common/Title";

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
        <NewsList articles={[]} isLoading={true} isFetching={true} />
      </div>
    );
  }

  const transformedArticles = articles?.map(transformToNYTArticle) || [];

  return (
    <section
      className="news-container search-results"
      aria-labelledby="search-heading"
    >
      <Title text={`Search results for "${searchTerm}"`} />
      <div aria-live="polite" aria-busy={isLoading || isFetching}>
        {isLoading || isFetching ? (
          <NewsList articles={[]} isLoading={true} isFetching={true} />
        ) : transformedArticles.length === 0 ? (
          <p className="no-results">No results found for "{searchTerm}".</p>
        ) : (
          <NewsList articles={transformedArticles} />
        )}
      </div>
    </section>
  );
};

export default SearchResults;
