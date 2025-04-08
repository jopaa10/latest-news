import LatestNewsWidget from "../LatestWidget";
import NewsList from "../news/NewsList";

const MobileView = ({ activeTab }: { activeTab: string }) => {
  let content = null;

  switch (activeTab) {
    case "Featured":
      content = <NewsList isMobile={true} />;
      break;
    case "Latest":
      content = <LatestNewsWidget />;
      break;
    default:
      content = null;
  }

  return <ul className="mobile-view">{content}</ul>;
};

export default MobileView;
