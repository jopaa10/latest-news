const NewsDetailsSkeleton = () => {
  return (
    <section
      className="news-details-skeleton"
      aria-label="Loading article"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="skeleton-title skeleton"></div>
      <div className="skeleton-image skeleton"></div>
      <div className="skeleton-paragraph skeleton"></div>
    </section>
  );
};

export default NewsDetailsSkeleton;
