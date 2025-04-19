import "../../styles/news.scss";
import { useNavigate } from "react-router-dom";
import fallbackImage from "../../assets/images/news.png";
import { slugify } from "../../utils/createSlug";
import { Bookmark, BookmarkBorder } from "../../assets/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBookmark, removeBookmark } from "../../api/bookmarks";
import { useBookmarks } from "../../hooks/useBookmarks";
import { SimplifiedBookmark } from "../../types/bookmarkTypes";
import { useState } from "react";
import Toast from "../common/Toast";
import { useAuth } from "../../hooks/useAuth";
import { NYTArticleWithId } from "../../types/newsTypes";

const NewsCard = ({ article }: { article: NYTArticleWithId }) => {
  const { isLoggedIn, token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: bookmarks = [] } = useBookmarks();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    duration: 0,
  });

  const articleId = article.articleId || article.uri || article.url;

  const isBookmarked =
    Array.isArray(bookmarks) &&
    bookmarks?.some((bm: SimplifiedBookmark) => bm.articleId === articleId);

  const image =
    article.multimedia?.[1]?.url ||
    article?.multimedia?.[0]?.url ||
    article.image ||
    fallbackImage;

  const altText =
    article?.multimedia?.[1]?.caption || "No image available for this article";

  const author =
    article?.byline?.replace(/^By\s+/i, "") || article.author || "";

  const openArticle = () => {
    let category = article.section?.toLowerCase() || "news";
    if (category.includes("/")) category = category.split("/")[0];

    navigate(`/${category}/article/${slugify(article.title)}`);
  };

  const showToast = (message: string, duration: number) => {
    setToast({ show: true, message, duration });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), duration * 1000);
  };

  const addBookmarkMutation = useMutation({
    mutationFn: () => addBookmark(article, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: () => removeBookmark(article.articleId || article.uri, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const handleBookmarkToggle = async (
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.stopPropagation();

    const optimistic = isBookmarked
      ? "Removing bookmark..."
      : "Adding bookmark...";
    showToast(optimistic, 1);

    try {
      const start = Date.now();
      if (isBookmarked) {
        await removeBookmarkMutation.mutateAsync();
        showToast("Bookmark removed", (Date.now() - start) / 1000);
      } else {
        await addBookmarkMutation.mutateAsync();
        showToast("Bookmark added", (Date.now() - start) / 1000);
      }
    } catch {
      showToast("Something went wrong", 1);
    }
  };

  const handleBookmarkToggleWithAnimation = (
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 500);
    handleBookmarkToggle(e);
  };

  const handleKeyPress =
    (handler: (e: React.KeyboardEvent | React.MouseEvent) => void) =>
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler(e);
      }
    };

  return (
    <>
      <Toast
        showToast={toast.show}
        message={toast.message}
        logoutCountdownDuration={toast.duration}
      />
      <li key={article.articleId} className="article-list__item">
        <div
          role="button"
          tabIndex={0}
          className="news-card"
          onClick={openArticle}
          onKeyDown={handleKeyPress(openArticle)}
          aria-label={`Read article titled ${article.title}`}
        >
          <img src={image} alt={altText} />
          <div className="news-content">
            <div className={`heading ${isLoggedIn ? "heading__bookmark" : ""}`}>
              <div className="category-container">
                <p
                  className="category title-category"
                  aria-label={`Article category: ${article.section}`}
                >
                  {article.section}
                </p>
                {isLoggedIn && (
                  <button
                    className="bookmark-btn"
                    aria-label={
                      isBookmarked ? "Remove bookmark" : "Add bookmark"
                    }
                    aria-pressed={isBookmarked}
                    onClick={handleBookmarkToggleWithAnimation}
                    onKeyDown={handleKeyPress(
                      handleBookmarkToggleWithAnimation
                    )}
                  >
                    {isBookmarked ? (
                      <Bookmark size={20} />
                    ) : (
                      <BookmarkBorder size={20} />
                    )}
                  </button>
                )}
              </div>
              <h2 className="title-medium">{article.title}</h2>
            </div>
            <p
              className="author title-small"
              aria-label={`Written by ${author}`}
            >
              {author}
            </p>
          </div>
        </div>
      </li>
    </>
  );
};

export default NewsCard;
