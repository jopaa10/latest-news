import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticlesByCategory, NYTArticle } from "../../api/nytApi";
import { slugify } from "../../utils/createSlug";

const NewsDetail = () => {
  const { category, slug } = useParams();

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery<NYTArticle[]>({
    queryKey: ["articles"],
    queryFn: () => fetchArticlesByCategory(category || "home"),
    enabled: !!category,
  });

  const article = articles?.find(
    (articleItem) => slugify(articleItem.title) === slug
  );

  if (isLoading) {
    return (
      <div className="news-detail">
        <div className="skeleton-title skeleton"></div>
        <div className="skeleton-image skeleton"></div>
        <div className="skeleton-paragraph skeleton"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-detail">
        <h2>Article not found.</h2>
      </div>
    );
  }

  const image = article?.multimedia?.[0]?.url;

  return (
    <div className="news-detail">
      {article ? (
        <>
          <h1>{article.title}</h1>
          {image && (
            <img
              src={image}
              alt={article.multimedia[0]?.caption}
              style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
            />
          )}
          <p>{article.abstract}</p>
        </>
      ) : (
        <p>Article not found.</p> // Or any other fallback you want
      )}
    </div>
  );
};

export default NewsDetail;
