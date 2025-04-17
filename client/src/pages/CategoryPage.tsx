import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchArticlesByCategory } from "../api/nytApi";
import "../styles/categoryPage.scss";
import { useSearch } from "../context/SearchContext";
import { NYTArticle } from "../types/newsTypes";
import NewsList from "../components/news/NewsList";
import Title from "../components/common/Title";

const CategoryPage = () => {
  const { category = "world" } = useParams();
  const { debounced } = useSearch();

  const {
    data: articles = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery<NYTArticle[]>({
    queryKey: ["articles", category],
    queryFn: () => fetchArticlesByCategory(category),
    staleTime: 1000 * 60 * 5,
  });

  const filtered = articles?.filter((article) =>
    article.title.toLowerCase().includes(debounced.toLowerCase())
  );

  if (isLoading || isFetching) {
    return (
      <div className="news-container news-skeleton">
        <Title text={`${category} news`} />
        <NewsList articles={[]} isLoading={true} />
      </div>
    );
  }
  if (isError) return <p>Something went wrong while fetching articles.</p>;

  return (
    <div className="news-container">
      <Title text={`${category} news`} />
      {filtered.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <NewsList articles={filtered} />
      )}
    </div>
  );
};

export default CategoryPage;
