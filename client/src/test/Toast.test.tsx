import { render, screen } from "@testing-library/react";
import Toast from "../components/common/Toast";
import "@testing-library/jest-dom";

describe("Toast component", () => {
  it("renders message when showToast is true", () => {
    render(
      <Toast
        showToast={true}
        message="Test toast message"
        logoutCountdownDuration={4}
      />
    );

    expect(screen.getByText("Test toast message")).toBeInTheDocument();
  });

  it("does not render when showToast is false", () => {
    render(
      <Toast
        showToast={false}
        message="Should not show"
        logoutCountdownDuration={4}
      />
    );

    const toast = screen.queryByText("Should not show");
    expect(toast).not.toBeInTheDocument();
  });

  it("applies correct animation duration style", () => {
    const { container } = render(
      <Toast showToast={true} message="Animated" logoutCountdownDuration={3} />
    );

    const bgDiv = container.querySelector(
      ".custom-toast__background"
    ) as HTMLDivElement;
    expect(bgDiv).toHaveStyle("animation-duration: 30s");
  });
});
