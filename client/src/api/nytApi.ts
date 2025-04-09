export interface NYTArticle {
  section: string;
  subsection: string;
  title: string;
  abstract: string;
  url: string;
  uri: string;
  byline: string;
  item_type: string;
  updated_date: string;
  created_date: string;
  published_date: string;
  material_type_facet: string;
  kicker: string;
  des_facet: string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  multimedia: {
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
  }[];
  short_url: string;
}

const API_BASE_URL = "https://api.nytimes.com/svc";
const API_KEY = import.meta.env.VITE_NYT_API_KEY;

export const fetchArticlesByCategory = async (
  category: string
): Promise<NYTArticle[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/topstories/v2/${category}.json?api-key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.results) return [];

    const sorted = data.results.sort(
      (a: NYTArticle, b: NYTArticle) =>
        new Date(b.published_date).getTime() -
        new Date(a.published_date).getTime()
    );

    if (category.toLowerCase() === "home") {
      return sorted;
    }

    return data.results.filter(
      (article: NYTArticle) =>
        (article.section.toLowerCase() || data.section.toLowerCase()) ===
        category.toLowerCase()
    );
  } catch (error) {
    console.error("Error fetching NYT articles:", error);
    return [];
  }
};

const LIMIT = 10;

export const fetchLatestArticles = async ({ pageParam = 0 }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news/v3/content/all/all.json?api-key=${API_KEY}&limit=${LIMIT}&offset=${pageParam}`
    );
    const data = await response.json();

    if (!data.results) {
      return { results: [], nextOffset: 0 };
    }

    return {
      results: data.results,
      nextOffset: data.results.length === LIMIT ? pageParam + LIMIT : null,
    };
  } catch (error) {
    console.error("Error fetching NYT latest articles", error);
    return { results: [], nextOffset: 0 };
  }
};
