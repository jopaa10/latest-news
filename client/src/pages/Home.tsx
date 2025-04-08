import "../styles/home.scss";
import MobileNavbar from "../components/mobile/MobileMenu";
import { useState } from "react";
import MobileView from "../components/mobile/MobileView";
import DesktopView from "../components/DesktopView";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Featured");

  return (
    <div className="home-container">
      <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <p className="home-container__title">news</p>
      <MobileView activeTab={activeTab} />
      <DesktopView />
    </div>
  );
};

export default Home;
