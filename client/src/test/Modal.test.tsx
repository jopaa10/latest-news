import { fireEvent, render, screen } from "@testing-library/react";
import { AuthContext } from "../hooks/useAuth";
import Modal from "../components/modal/LoginModal";
import { BrowserRouter } from "react-router-dom";

const closeModal = jest.fn();
const mockSetToken = jest.fn();
const mockMarkAsRegistered = jest.fn();

jest.mock("../api/auth", () => ({
  login: jest.fn(() =>
    Promise.resolve({ ok: true, data: { token: "mock-token" } })
  ),
  register: jest.fn(() =>
    Promise.resolve({ ok: true, data: { token: "mock-token" } })
  ),
  resendVerification: jest.fn(() => Promise.resolve({})),
}));

const renderModal = () => {
  render(
    <BrowserRouter>
      {" "}
      {/* Wrap with BrowserRouter */}
      <AuthContext.Provider
        value={{
          token: null,
          isLoggedIn: false,
          username: "",
          setToken: mockSetToken,
          handleLogout: jest.fn(),
          markAsRegistered: mockMarkAsRegistered,
        }}
      >
        <Modal closeModal={closeModal} />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe("Login/Register Modal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles successful login", async () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "validuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "ValidPassword123!" },
    });

    fireEvent.click(screen.getByText(/submit/i));

    await screen.findByText(/^login$/i);
    expect(mockSetToken).toHaveBeenCalledWith("mock-token");
  });

  it("shows error for invalid password format", async () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "some@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByText(/submit/i));

    const passwordErrorMessage = await screen.findByText(/password must/i);
    expect(passwordErrorMessage).toBeInTheDocument();
  });

  it("shows error for invalid email format", async () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "invalidemail" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Somepassword123." },
    });

    fireEvent.click(screen.getByText(/submit/i));

    const emailErrorMessage = await screen.findByText(/email/i);
    expect(emailErrorMessage).toBeInTheDocument();
  });

  it("switches to register and shows required name fields", async () => {
    renderModal();

    fireEvent.click(screen.getByText(/sign up/i));

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^surname$/i)).toBeInTheDocument();
  });
});
