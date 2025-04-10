import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import Separator from "../assets/icons/Separator";
import "../styles/cardLayout.scss";
import { useState } from "react";
import { SearchContext } from "../context/SearchContext";
import Hero from "./common/Hero";
import MobileNavbar from "./mobile/MobileNavbar";

const CardLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  const handleSearchClick = () => {
    const handler = setTimeout(() => {
      setDebounced(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  };

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebounced(searchTerm);
  //   }, 300);

  //   return () => clearTimeout(handler);
  // }, [searchTerm]);

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, debounced, handleSearchClick }}
    >
      <Hero />
      <main>
        <MobileNavbar />
        <SearchBar />
        <Separator size={"100%"} />
        <div className="main-container">
          <Sidebar />
          <Outlet />
        </div>
      </main>
    </SearchContext.Provider>
  );
};

export default CardLayout;
