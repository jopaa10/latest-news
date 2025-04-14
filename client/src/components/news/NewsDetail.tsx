import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchArticleByTitle } from "../../api/nytApi";
import { slugify } from "../../utils/createSlug";
import { NewsArticle } from "../../types";

const NewsDetail = () => {
  const { slug } = useParams();

  const titleFromSlug = slug?.replace(/-/g, " ");

  const {
    data: articles,
    isLoading,
    isError,
    isFetching,
    error,
  } = useQuery<NewsArticle[]>({
    queryKey: ["search-article", titleFromSlug],
    queryFn: () => searchArticleByTitle(titleFromSlug || ""),
    enabled: !!titleFromSlug,
  });

  const article = articles?.find(
    (articleItem: NewsArticle) =>
      slugify(articleItem.headline.main).toLowerCase() === slug?.toLowerCase()
  );

  if (isLoading || isFetching) {
    return (
      <div className="news-detail">
        <div className="skeleton-title skeleton"></div>
        <div className="skeleton-image skeleton"></div>
        <div className="skeleton-paragraph skeleton"></div>
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="news-detail">
        <h2>There was an error while fetching</h2>
      </div>
    );
  }

  const image = article?.multimedia.default.url;

  return (
    <div className="news-detail">
      {article ? (
        <>
          <h1>{article?.headline.main}</h1>
          {image && (
            <img
              src={image}
              alt={article?.multimedia.caption}
              style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
            />
          )}
          <p>{article.abstract}</p>
        </>
      ) : (
        <p>Article not found.</p>
      )}
    </div>
  );
};

export default NewsDetail;
