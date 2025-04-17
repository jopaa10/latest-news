import NewsList from "./news/HomeNewsFeed";

const DesktopView = () => {
  return (
    <div className="desktop-view">
      <NewsList range="top" />
      <NewsList range="bottom" />
    </div>
  );
};

export default DesktopView;
