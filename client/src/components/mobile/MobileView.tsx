import NewsList from "../news/HomeNewsFeed";
import LatestNewsWidget from "../news/LatestNewsWidget";

const MobileView = ({ activeTab }: { activeTab: string }) => {
  let content = null;

  switch (activeTab) {
    case "Featured":
      content = <NewsList />;
      break;
    case "Latest":
      content = <LatestNewsWidget />;
      break;
    default:
      content = null;
  }

  return <div className="mobile-view">{content}</div>;
};

export default MobileView;
