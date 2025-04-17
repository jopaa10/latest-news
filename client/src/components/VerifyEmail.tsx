import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import { Button } from "./common/Button";
import "../styles/verifyEmail.scss";
import { useAuth } from "../hooks/useAuth";

const VerifyEmail = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error" | "alreadyVerified"
  >("pending");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const hasVerified = useRef(false);
  const { setToken } = useAuth();

  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;

    verifyEmail(token)
      .then((data) => {
        if (data?.message === "Email successfully verified!") {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setVerificationStatus("success");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 2000);
        } else if (data?.message === "Email already verified!") {
          setVerificationStatus("alreadyVerified");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 2000);
        } else if (data?.error) {
          setVerificationStatus("error");
          setErrorMessage(data.error || "Something went wrong");
        }
      })
      .catch((error) => {
        console.error(error);
        setVerificationStatus("error");
        setErrorMessage("Failed to verify email. Please try again later.");
      });
  }, [token, navigate]);

  if (verificationStatus === "pending") {
    return (
      <section role="status" aria-live="polite">
        <h2 id="email-status-heading">Verifying your email...</h2>
        <p>Please wait while we verify your email.</p>
      </section>
    );
  }

  if (verificationStatus === "error") {
    return (
      <section className="error-message" role="alert" aria-live="assertive">
        <h2>Email verification failed: {errorMessage}</h2>
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

  if (verificationStatus === "alreadyVerified") {
    return (
      <section
        className="already-verified-message"
        role="status"
        aria-live="polite"
      >
        <h2>Email already verified!</h2>
        <p>
          Your email has already been verified. You will be redirected to the
          home page soon.
        </p>
      </section>
    );
  }

  return (
    <section className="success-message" role="status" aria-live="polite">
      <h2>Email successfully verified!</h2>
      <p>Redirecting to home...</p>
    </section>
  );
};

export default VerifyEmail;
