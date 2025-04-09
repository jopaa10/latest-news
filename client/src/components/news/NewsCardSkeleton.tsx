const NewsCardSkeleton = () => {
  return (
    <div className="news-card skeleton">
      <div className="skeleton-img" />
      <div className="news-content">
        <div className="heading">
          <div className="skeleton-category" />
          <div className="skeleton-title" />
          <div className="skeleton-title short" />
        </div>
        <div className="skeleton-author" />
      </div>
    </div>
  );
};

export default NewsCardSkeleton;
