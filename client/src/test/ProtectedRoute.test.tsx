import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { jest } from "@jest/globals";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

jest.mock("../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockSetToken = jest.fn();
const mockMarkAsRegistered = jest.fn();
const mockHandleLogout = jest.fn();

describe("ProtectedRoute", () => {
  it("renders the element when the user is logged in", () => {
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      isLoggedIn: true,
      token: "",
      username: "test",
      setToken: mockSetToken,
      handleLogout: mockHandleLogout,
      markAsRegistered: mockMarkAsRegistered,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute element={<div>Protected Content</div>} />
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to the homepage when the user is not logged in", async () => {
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      isLoggedIn: false,
      token: "",
      username: "test",
      setToken: mockSetToken,
      handleLogout: mockHandleLogout,
      markAsRegistered: mockMarkAsRegistered,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute element={<div>Protected Content</div>} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });
});
