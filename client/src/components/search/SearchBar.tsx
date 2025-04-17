import SearchIcon from "../../assets/icons/SearchIcon";
import { useSearch } from "../../context/SearchContext";
import "../../styles/searchBar.scss";
import Logo from "../common/Logo";
import { Close } from "../../assets/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { useEffect } from "react";

function SearchBar({ isChecked = false }: { isChecked?: boolean }) {
  const { searchTerm, setSearchTerm, handleSearchClick } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    handleSearchClick();
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchClick();
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSearchTerm("");
    }
  }, [location.pathname, setSearchTerm]);

  return (
    <>
      <div
        className={`search-bar ${isChecked ? "search-bar--checked" : ""}`}
        role="search"
        aria-label="Search news articles"
      >
        <Logo isChecked={isChecked} />

        <form
          className="search-container"
          role="search"
          aria-label="Search form"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="search-input"
            style={{ display: "none" }}
            aria-hidden="true"
          >
            Search for news articles
          </label>

          <div className="search-container__input-icon-container">
            <span aria-hidden="true">
              <SearchIcon size={20} />
            </span>
            <input
              id="search-input"
              type="text"
              placeholder="Search news"
              value={searchTerm}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {searchTerm && (
              <button
                aria-label="clear search input"
                className="clear-search"
                onClick={handleClearSearch}
              >
                <Close fill="black" />
              </button>
            )}
          </div>
          <Button
            onClick={handleSearchClick}
            ariaLabel="click to search"
            cls="search-btn"
          >
            search
          </Button>
        </form>
      </div>
    </>
  );
}

export default SearchBar;
