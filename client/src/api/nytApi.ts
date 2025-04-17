import { NewsArticle, NYTArticle } from "../types/newsTypes";
import { SECTIONS } from "../utils/constants";

const API_BASE_URL = "https://api.nytimes.com/svc";
const API_KEY = import.meta.env.VITE_NYT_API_KEY;

export const fetchArticlesByCategory = async (
  category: string
): Promise<NYTArticle[]> => {
  if (!SECTIONS.includes(category.toLowerCase())) {
    console.warn(
      `${category} is not a valid category. Falling back to "home".`
    );
    category = "home";
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/topstories/v2/${category.toLowerCase()}.json?api-key=${API_KEY}`
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

    return sorted.filter((article: NYTArticle) => {
      const articleSection =
        article.section?.toLowerCase() || data.section?.toLowerCase();
      return articleSection === category.toLowerCase();
    });
  } catch (error) {
    console.error("Error fetching NYT articles:", error);
    return [];
  }
};

export const fetchLatestArticles = async ({ pageParam = 0 }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news/v3/content/all/all.json?api-key=${API_KEY}&offset=${pageParam}`
    );
    const data = await response.json();

    if (!data.results) {
      return { results: [], nextOffset: 0 };
    }

    const nextOffset =
      data.results.length > 0 ? pageParam + data.results.length : null;

    return {
      results: data.results,
      nextOffset,
    };
  } catch (error) {
    console.error("Error fetching NYT latest articles", error);
    return { results: [], nextOffset: 0 };
  }
};

export const searchArticleByTitle = async (
  title: string
): Promise<NewsArticle[]> => {
  const response = await fetch(
    `${API_BASE_URL}/search/v2/articlesearch.json?q=${encodeURIComponent(
      title
    )}&api-key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Error fetching articles");
  }
  const data = await response.json();
  return data.response.docs;
};
