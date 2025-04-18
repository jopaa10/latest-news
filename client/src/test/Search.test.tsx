import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { jest } from "@jest/globals";
import SearchBar from "../components/search/SearchBar";
import { useSearch } from "../context/SearchContext";

jest.mock("../context/SearchContext", () => ({
  useSearch: jest.fn(),
}));

describe("SearchBar", () => {
  const mockHandleSearchClick = jest.fn();
  const mockSetSearchTerm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSearch as jest.MockedFunction<typeof useSearch>).mockReturnValue({
      searchTerm: "",
      setSearchTerm: mockSetSearchTerm,
      debounced: "",
      handleSearchClick: mockHandleSearchClick,
    });
  });

  it("should call handleSearchClick when search button is clicked", () => {
    render(
      <BrowserRouter>
        {" "}
        {/* Wrap in BrowserRouter */}
        <SearchBar />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    expect(mockHandleSearchClick).toHaveBeenCalled();
  });

  it("should reset search term on navigation", () => {
    render(
      <BrowserRouter>
        {" "}
        {/* Wrap in BrowserRouter */}
        <SearchBar />
      </BrowserRouter>
    );

    expect(mockSetSearchTerm).toHaveBeenCalledWith("");
  });
});
