import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticlesByCategory, NYTArticle } from "../../api/nytApi";

const NewsDetail = () => {
  const { category, encodedUrl } = useParams();
  const articleUrl = decodeURIComponent(encodedUrl || "");

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery<NYTArticle[]>({
    queryKey: ["articles", category],
    queryFn: () => fetchArticlesByCategory(category || "home"),
    enabled: !!category,
  });

  const article = articles?.find((a) => a.url === articleUrl);

  if (isLoading) return <div>Loading article...</div>;
  if (error || !article) return <div>Article not found.</div>;

  const image = article.multimedia?.[0]?.url;

  return (
    <div className="news-detail">
      <h1>{article.title}</h1>
      {image && (
        <img
          src={image}
          alt={article.title}
          style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
        />
      )}
      <p>{article.abstract}</p>
    </div>
  );
};

export default NewsDetail;
