import SearchIcon from "../assets/icons/SearchIcon";
import { useSearch } from "../context/SearchContext";
import "./../styles/searchBar.scss";
import Logo from "./common/Logo";

function SearchBar({ isChecked = false }: { isChecked?: boolean }) {
  const { searchTerm, setSearchTerm, handleSearchClick } = useSearch();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      handleSearchClick();
    }
  };

  return (
    <div className={`search-bar ${isChecked ? "search-bar--checked" : ""}`}>
      <Logo isChecked={isChecked} />
      <div className="search-container">
        <span className="search-container__input-icon-container">
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="Search news"
            value={searchTerm}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
          />
        </span>
        <button onClick={handleSearchClick}>search</button>
      </div>
    </div>
  );
}

export default SearchBar;
