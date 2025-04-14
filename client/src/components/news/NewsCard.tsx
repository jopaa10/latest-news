import { useNavigate } from "react-router-dom";
import "../../styles/news.scss";
import fallbackImage from "../../assets/images/news.png";
import { slugify } from "../../utils/createSlug";
import { useAuth } from "../../context/AuthContext";
import { Bookmark, BookmarkBorder } from "../../assets/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBookmark, removeBookmark } from "../../api/bookmarks";
import { useBookmarks } from "../../hooks/useBookmarks";
import { NYTArticleWithId } from "../../types";

const NewsCard = ({ article }: { article: NYTArticleWithId }) => {
  const { isLoggedIn, token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: bookmarks = [] } = useBookmarks();

  const isBookmarked = bookmarks?.some(
    (bm: NYTArticleWithId) =>
      bm.articleId === article.articleId ||
      bm.url === article.url ||
      bm.uri === article.uri
  );

  const image = article.multimedia?.[2]?.url || article?.multimedia?.[0]?.url;
  const altText =
    article?.multimedia?.[1]?.caption || "No image available for this article";
  const author = article?.byline?.replace(/^By\s+/i, "") || "";

  const handleClick = () => {
    let category = article.section.toLowerCase();

    if (!category) {
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split("/");
      category = pathParts[1];
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

  const handleBookmarkToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      removeBookmarkMutation.mutate();
    } else {
      addBookmarkMutation.mutate();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="news-card"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <img src={image || fallbackImage} alt={altText} />
      <div className="news-content">
        <div className="heading">
          <p
            className="category"
            aria-label={`Article category: ${article.section}`}
          >
            {article.section}
          </p>
          <h2 aria-label={`Article title: ${article.title}`}>
            {article.title}
          </h2>
          {isLoggedIn && (
            <button
              className="bookmark-btn"
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              aria-pressed={isBookmarked}
              onClick={handleBookmarkToggle}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleBookmarkToggle(e);
                }
              }}
            >
              {isBookmarked ? (
                <Bookmark size={16} />
              ) : (
                <BookmarkBorder size={16} />
              )}
            </button>
          )}
        </div>
        <p className="author" aria-label={`Author ${author}`}>
          {author}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;
