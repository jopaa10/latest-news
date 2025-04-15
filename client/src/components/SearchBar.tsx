import SearchIcon from "../assets/icons/SearchIcon";
import { useSearch } from "../context/SearchContext";
import "./../styles/searchBar.scss";
import Logo from "./common/Logo";
import { Close } from "../assets/icons";
import { useNavigate } from "react-router-dom";

function SearchBar({ isChecked = false }: { isChecked?: boolean }) {
  const { searchTerm, setSearchTerm, handleSearchClick } = useSearch();
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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

  return (
    <>
      <div className={`search-bar ${isChecked ? "search-bar--checked" : ""}`}>
        <Logo isChecked={isChecked} />

        <div className="search-container">
          <div className="search-container__input-icon-container">
            <span aria-hidden={"true"}>
              <SearchIcon size={20} />
            </span>
            <input
              type="text"
              placeholder="Search news"
              value={searchTerm}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
            />
            {searchTerm && (
              <button className="clear-search" onClick={handleClearSearch}>
                <Close fill="black" />
              </button>
            )}
          </div>
          <button onClick={handleSearchClick}>search</button>
        </div>
      </div>
    </>
  );
}

export default SearchBar;
