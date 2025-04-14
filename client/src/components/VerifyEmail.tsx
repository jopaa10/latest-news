import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/auth";

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

  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;

    verifyEmail(token)
      .then((data) => {
        if (data?.message === "Email successfully verified!") {
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
    return <div>Verifying your email...</div>;
  }

  if (verificationStatus === "error") {
    return (
      <div className="error-message">
        <div>Email verification failed: {errorMessage}</div>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  if (verificationStatus === "alreadyVerified") {
    return (
      <div className="already-verified-message">
        <h3>Email already verified!</h3>
        <p>
          Your email has already been verified. You will be redirected to the
          home page soon.
        </p>
      </div>
    );
  }

  return (
    <div className="success-message">
      <h3>Email successfully verified!</h3>
      <p>Redirecting to home...</p>
    </div>
  );
};

export default VerifyEmail;
