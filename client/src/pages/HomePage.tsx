import "../styles/home.scss";
import MobileNavbar from "../components/mobile/MobileMenu";
import { useState } from "react";
import MobileView from "../components/mobile/MobileView";
import DesktopView from "../components/DesktopView";
import Title from "../components/common/Title";
import { useIsMobile } from "../hooks/useIsMobile";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Featured");
  const isMobile = useIsMobile(640);

  return (
    <div className="home-container">
      <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {!isMobile && <Title text="news" />}
      <MobileView activeTab={activeTab} />
      <DesktopView />
    </div>
  );
};

export default Home;
