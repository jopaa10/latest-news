import LatestNewsWidget from "./LatestWidget";
import NewsList from "./news/NewsList";

const DesktopView = () => {
  return (
    <div className="desktop-view">
      <section className="top-section">
        <NewsList range="top" isMobile={false} />
        <LatestNewsWidget />
      </section>
      <section className="bottom-section">
        <NewsList range="bottom" isMobile={false} />
      </section>
    </div>
  );
};

export default DesktopView;
