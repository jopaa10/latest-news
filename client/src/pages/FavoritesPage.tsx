import { useBookmarks } from "../hooks/useBookmarks";
import NewsList from "../components/news/NewsList";
import Title from "../components/common/Title";

const FavoritesPage = () => {
  const { data: bookmarks, isLoading, isError } = useBookmarks();

  if (isLoading) {
    return (
      <div className="news-container news-skeleton">
        <Title text="Your Bookmarked Article" />
        <NewsList articles={[]} isLoading={true} />
      </div>
    );
  }
  if (isError) return <p>Error loading bookmarks.</p>;

  return (
    <div className="favorites-container">
      <Title text="Your Bookmarked Article" />
      {Array.isArray(bookmarks) && bookmarks?.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <NewsList articles={Array.isArray(bookmarks) ? bookmarks : []} />
      )}
    </div>
  );
};

export default FavoritesPage;
