import { useSearch } from "../context/SearchContext";
import LatestNewsWidget from "./news/LatestNewsWidget";
import NewsCard from "./news/NewsCard";
import NewsList from "./news/NewsList";
import { useQuery } from "@tanstack/react-query";
import { searchArticleByTitle } from "../api/nytApi";
import { NewsArticle, NYTArticle } from "../types";
import { useIsMobile } from "../hooks/useIsMobile";

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

const DesktopView = () => {
  const { debounced: searchTerm } = useSearch();
  const isMobile = useIsMobile();
  const isSearching = searchTerm.trim().length > 0;

  const {
    data: articles,
    isLoading,
    isError,
    isFetching,
    error,
  } = useQuery<NewsArticle[]>({
    queryKey: ["search-article", searchTerm],
    queryFn: () => searchArticleByTitle(searchTerm),
    enabled: isSearching,
  });

  const hasResults = isSearching && articles && articles.length > 0;

  const transformedArticles = articles?.map(transformToNYTArticle) || [];

  return (
    <>
      {isSearching && !isMobile ? (
        <div className="news-container">
          {isLoading || isFetching ? (
            <p>Loading search results...</p>
          ) : isError ? (
            <p>Error: {(error as Error).message}</p>
          ) : hasResults ? (
            <div className="news-cards">
              <ul className="article-list">
                {transformedArticles.map((article, index) => (
                  <li key={index} className="article-list__item">
                    <NewsCard key={index} article={article} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No articles found.</p>
          )}
        </div>
      ) : (
        <div className="desktop-view">
          <section className="top-section">
            <NewsList range="top" />
            <LatestNewsWidget />
          </section>
          <section className="bottom-section">
            <NewsList range="bottom" />
          </section>
        </div>
      )}
    </>
  );
};

export default DesktopView;
