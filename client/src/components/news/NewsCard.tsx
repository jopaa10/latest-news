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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastDuration, setToastDuration] = useState(0);

  const articleId = article.articleId || article.uri || article.url;

  const isBookmarked =
    Array.isArray(bookmarks) &&
    bookmarks?.some((bm: SimplifiedBookmark) => bm.articleId === articleId);

  const image =
    article.multimedia?.[1]?.url ||
    article?.multimedia?.[0]?.url ||
    article.image;

  const altText =
    article?.multimedia?.[1]?.caption || "No image available for this article";
  const author =
    article?.byline?.replace(/^By\s+/i, "") || article.author || "";

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    let category = article.section.toLowerCase();

    if (!category) {
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split("/");

      category = pathParts[1];
    }

    if (category.includes("/")) {
      category = category.split("/")[0];
    }

    navigate(`/${category}/article/${slugify(article.title)}`);
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

    const optimisticMessage = isBookmarked
      ? "Removing bookmark..."
      : "Adding bookmark...";

    setToastMessage(optimisticMessage);
    setToastDuration(1);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 1500);

    const start = Date.now();

    try {
      let message = "";
      if (isBookmarked) {
        await removeBookmarkMutation.mutateAsync();
        message = "Bookmark removed";
      } else {
        await addBookmarkMutation.mutateAsync();
        message = "Bookmark added";
      }

      const duration = (Date.now() - start) / 1000;

      setToastMessage(message);
      setToastDuration(duration);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, duration * 500);
    } catch (err) {
      console.log(err);
      setToastMessage("Something went wrong");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 1000);
    }
  };

  const handleBookmarkToggleWithAnimation = (
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.stopPropagation();
    const button = e.currentTarget;
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
    }, 500);
    handleBookmarkToggle(e);
  };

  return (
    <>
      <Toast
        showToast={showToast}
        message={toastMessage}
        logoutCountdownDuration={toastDuration}
      />
      <li key={article.articleId} className="article-list__item">
        <div
          role="button"
          tabIndex={0}
          className="news-card"
          onClick={(e) => handleClick(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick(e);
            }
          }}
          aria-label={`Read article titled ${article.title}`}
        >
          <img src={image || fallbackImage} alt={altText} />
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleBookmarkToggleWithAnimation(e);
                      }
                    }}
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
