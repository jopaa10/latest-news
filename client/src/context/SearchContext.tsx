import { createContext, useContext } from "react";

export const SearchContext = createContext<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debounced: string;
  handleSearchClick: () => void;
}>({
  searchTerm: "",
  setSearchTerm: () => {},
  debounced: "",
  handleSearchClick: () => {},
});

export const useSearch = () => useContext(SearchContext);
