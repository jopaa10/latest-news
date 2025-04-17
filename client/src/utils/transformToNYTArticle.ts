import { NewsArticle, NYTArticle } from "../types/newsTypes";

export const transformToNYTArticle = (article: NewsArticle): NYTArticle => {
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
