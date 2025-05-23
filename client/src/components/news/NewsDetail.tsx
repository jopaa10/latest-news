import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchArticleByTitle } from "../../api/nytApi";
import { slugify } from "../../utils/createSlug";
import { NewsArticle } from "../../types/newsTypes";
import NewsDetailsSkeleton from "./NewsDetailsSkeleton";

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
    return <NewsDetailsSkeleton />;
  }

  if (isError || error) {
    return (
      <section
        role="alert"
        aria-live="assertive"
        aria-label="Error fetching article"
      >
        <h2>There was an error while fetching</h2>
      </section>
    );
  }

  const image = article?.multimedia.default.url;
  const imageAlt = article?.multimedia?.caption || "News article image";

  return (
    <article className="news-details">
      {article ? (
        <>
          <h1>{article?.headline.main}</h1>
          {image && (
            <img
              src={image}
              alt={imageAlt}
              style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
            />
          )}
          <p className="title-medium">{article.abstract}</p>
        </>
      ) : (
        <p className="title-medium">Article not found.</p>
      )}
    </article>
  );
};

export default NewsDetail;
