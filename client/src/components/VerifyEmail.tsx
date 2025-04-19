import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import { Button } from "./common/Button";
import "../styles/verifyEmail.scss";
import { useAuth } from "../hooks/useAuth";
import { Status } from "../types/emailTypes";
import { REDIRECT_DELAY } from "../utils/constants";

const statusMessages: Record<Status, { title: string; description: string }> = {
  pending: {
    title: "Verifying your email...",
    description: "Please wait while we verify your email.",
  },
  success: {
    title: "Email successfully verified!",
    description: "Redirecting to home...",
  },
  alreadyVerified: {
    title: "Email already verified!",
    description:
      "Your email has already been verified. You will be redirected to the home page soon.",
  },
  error: {
    title: "Email verification failed",
    description: "Failed to verify email. Please try again later.",
  },
};

const VerifyEmail = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [status, setStatus] = useState<Status>("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const hasVerified = useRef(false);

  const handleVerificationResponse = async () => {
    try {
      const data = await verifyEmail(token!);

      if (data?.message === "Email successfully verified!") {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setStatus("success");
        setTimeout(() => navigate("/"), REDIRECT_DELAY);
      } else if (data?.message === "Email already verified!") {
        setStatus("alreadyVerified");
        setTimeout(() => navigate("/"), REDIRECT_DELAY);
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || statusMessages.error.description);
      } else {
        setErrorMessage(statusMessages.error.description);
      }
      localStorage.removeItem("token");
      setToken("");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;
    handleVerificationResponse();
  }, [token]);

  const { title, description } = statusMessages[status];

  if (status === "error") {
    return (
      <section className="error-message" role="alert" aria-live="assertive">
        <h2>
          {title}: {errorMessage}
        </h2>
        <Button
          ariaLabel="go to home"
          onClick={() => navigate("/")}
          backgroundColor="#fff"
          textColor="#000"
        >
          Go to Home
        </Button>
      </section>
    );
  }

  return (
    <section className={`${status}-message`} role="status" aria-live="polite">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
};

export default VerifyEmail;
