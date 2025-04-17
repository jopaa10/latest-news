import NewsCard from "./NewsCard";
import NewsCardSkeleton from "./NewsCardSkeleton";
import { NewsListProps } from "../../types/newsTypes";

const NewsList = ({
  articles,
  isLoading = false,
  isFetching = false,
  skeletonCount = 6,
  cls,
}: NewsListProps) => {
  if (isLoading) {
    return (
      <ul
        className="article-list news-skeleton"
        aria-busy="true"
        aria-label="Loading articles"
      >
        {[...Array(skeletonCount)].map((_, index) => (
          <li key={index} className="article-list__item" aria-hidden="true">
            <NewsCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={`article-list ${cls}`}
      role="list"
      aria-live="polite"
      aria-busy={isFetching}
    >
      {articles.map((article) => (
        <NewsCard article={article} />
      ))}
    </ul>
  );
};

export default NewsList;
