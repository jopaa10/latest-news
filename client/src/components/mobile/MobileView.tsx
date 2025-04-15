import { useQuery } from "@tanstack/react-query";
import { searchArticleByTitle } from "../../api/nytApi";
import { useSearch } from "../../context/SearchContext";
import { NewsArticle, NYTArticle } from "../../types";
import NewsCard from "../news/NewsCard";
import NewsList from "../news/NewsList";
import LatestNewsWidget from "../news/LatestNewsWidget";

const transformToNYTArticle = (article: NewsArticle): NYTArticle => {
  return {
    abstract: article.abstract,
    section: article.section_name || "Unknown",
    subsection: article.subsection_name || "Unknown",
    title: article.headline.main || "No title",
    url: article.web_url || "",
    uri: article.uri,
    byline: article.byline.original || "No byline",
    item_type: article.document_type || "Unknown",
    updated_date: article.pub_date,
    created_date: article.pub_date,
    published_date: article.pub_date,
    material_type_facet: "",
    kicker: article.headline.kicker || "No kicker",
    des_facet: [],
    org_facet: [],
    per_facet: [],
    geo_facet: [],
    multimedia: [
      {
        url: article.multimedia.default.url || "",
        format: "Unknown",
        height: article.multimedia.default.height || 0,
        width: article.multimedia.default.width || 0,
        type: "image",
        subtype: "photo",
        caption: article.multimedia.caption || "No caption",
        copyright: article.multimedia.credit || "No copyright",
      },
    ],
    short_url: article.web_url || "",
  };
};

const MobileView = ({ activeTab }: { activeTab: string }) => {
  const { debounced } = useSearch();
  const isSearching = debounced.trim().length > 0;

  const {
    data: articles,
    isLoading,
    isError,
    error,
  } = useQuery<NewsArticle[]>({
    queryKey: ["search-article", debounced],
    queryFn: () => searchArticleByTitle(debounced),
    enabled: isSearching,
  });

  const transformedArticles = articles?.map(transformToNYTArticle) || [];

  let content = null;

  if (isSearching) {
    if (isLoading) {
      content = <p>Loading search results...</p>;
    } else if (isError) {
      content = <p>Error: {(error as Error).message}</p>;
    } else if (articles && articles.length > 0) {
      content = (
        <div className="news-flex">
          {transformedArticles.map((article) => (
            <NewsCard article={article} />
          ))}
        </div>
      );
    } else {
      content = <p>No results found.</p>;
    }
  } else {
    switch (activeTab) {
      case "Featured":
        content = <NewsList />;
        break;
      case "Latest":
        content = <LatestNewsWidget />;
        break;
      default:
        content = null;
    }
  }

  return <div className="mobile-view">{content}</div>;
};

export default MobileView;
