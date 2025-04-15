import { NYTArticle, SimplifiedBookmark } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const addBookmark = async (
  article: NYTArticle,
  token: string | null
) => {
  const res = await fetch(`${API_BASE_URL}/bookmarks/add-bookmark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: article.url,
      article,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to add bookmark");
  }

  return res.json();
};

export const removeBookmark = async (
  articleId: string,
  token: string | null
) => {
  const res = await fetch(
    `${API_BASE_URL}/bookmarks/remove?articleId=${encodeURIComponent(
      articleId
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to remove bookmark");
  }

  return res.json();
};

export const getBookmarks = async (
  token: string | null
): Promise<SimplifiedBookmark> => {
  const res = await fetch(`${API_BASE_URL}/bookmarks/get-bookmarks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch bookmarks");
  }

  const data = await res.json();

  return data.map((item: SimplifiedBookmark) => ({
    articleId: item.articleId,
    title: item.title,
    author: item.author,
    image: item.image,
    section: item.section,
  }));
};
