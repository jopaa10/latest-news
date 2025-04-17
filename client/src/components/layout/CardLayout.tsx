import "../../styles/cardLayout.scss";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../navbar/Sidebar";
import SearchBar from "../SearchBar";
import Separator from "../../assets/icons/Separator";
import { useEffect, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import Hero from "../common/Hero";
import MobileNavbar from "../mobile/MobileNavbar";
import { AuthProvider } from "../../context/AuthContext";
import { useIsMobile } from "../../hooks/useIsMobile";

const CardLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    const trimmed = searchTerm.trim();

    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  useEffect(() => {
    if (!isMobile) return;

    const trimmed = searchTerm.trim();

    if (trimmed === "") {
      setDebounced("");
      navigate("/");
      return;
    }

    if (trimmed.length < 3) return;

    const handler = setTimeout(() => {
      setDebounced(trimmed);

      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, isMobile]);

  return (
    <AuthProvider>
      <SearchContext.Provider
        value={{ searchTerm, setSearchTerm, debounced, handleSearchClick }}
      >
        <header>
          <Hero />
        </header>
        <main>
          <MobileNavbar />
          <SearchBar />
          <span aria-hidden={"true"}>
            <Separator size={"100%"} />
          </span>
          <div className="main-container">
            <Sidebar />
            <Outlet />
          </div>
        </main>
      </SearchContext.Provider>
    </AuthProvider>
  );
};

export default CardLayout;
