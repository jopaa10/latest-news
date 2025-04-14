import NewsCard from "../components/news/NewsCard";
import { useBookmarks } from "../hooks/useBookmarks";
import NewsCardSkeleton from "../components/news/NewsCardSkeleton";
import { NYTArticle } from "../types";

const FavoritesPage = () => {
  const { data: bookmarks, isLoading, isError } = useBookmarks();

  if (isLoading) {
    return (
      <div className="news-container news-skeleton">
        <h2>Your Bookmarked Articles</h2>
        <ul className="article-list">
          {[...Array(6)].map((_, index) => (
            <li key={index} className="article-list__item">
              <NewsCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (isError) return <p>Error loading bookmarks.</p>;

  return (
    <div className="favorites-container">
      <h2>Your Bookmarked Articles</h2>
      {bookmarks?.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <ul className="article-list">
          {bookmarks?.map((article: NYTArticle, index: number) => (
            <li key={index}>
              <NewsCard article={article} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;
