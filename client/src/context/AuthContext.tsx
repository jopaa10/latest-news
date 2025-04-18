import React, { useState, useEffect } from "react";
import { fetchCurrentUser } from "../api/auth";
import Toast from "../components/common/Toast";
import { useNavigate } from "react-router-dom";
import { AuthProviderProps } from "../types/authTypes";
import { AuthContext } from "../hooks/useAuth";
import { isTokenExpired } from "../utils/isTokenExpired";
import { COUNTDOWN_DURATION, IDLE_TIMEOUT } from "../utils/constants";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);
  const [username, setUsername] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showToastMsg, setToastMessage] = useState("");
  const [logoutCountdown, setLogoutCountdown] = useState<number | null>(0);
  const [toastType, setToastType] = useState<
    "register" | "idle" | "logout" | null
  >(null);

  const navigate = useNavigate();

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
    setIsLoggedIn(!!newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    updateToken(null);
    setUsername("");
    setToken(null);
    navigate("/");
  };

  const triggerLogoutWithToast = (message: string) => {
    setToastMessage(message);
    setToastType("idle");
    setShowToast(true);
    setLogoutCountdown(COUNTDOWN_DURATION);

    let countdown = COUNTDOWN_DURATION;
    const interval = setInterval(() => {
      countdown -= 1;
      setLogoutCountdown(countdown);

      if (countdown <= 0) {
        clearInterval(interval);
        handleLogout();
      }
    }, 1000);
  };

  const fetchUserData = (token: string) => {
    fetchCurrentUser(token)
      .then((data) => {
        if (data && data.name) {
          setUsername(data.name);
        }
      })
      .catch((error) => {
        const authErrors = ["Unauthorized", "UserNotFound", "Forbidden"];
        const message = error?.message || error?.response?.data?.message;

        if (authErrors.includes(message)) {
          triggerLogoutWithToast("Session expired. Logging out...");
        } else {
          console.warn("Non-auth error fetching user data:", error);
        }
      });
  };

  const markAsRegistered = () => {
    setToastType("register");
    setToastMessage("Verification email is sent. Please check your inbox.");
    setShowToast(true);

    let countdown = 10;
    setLogoutCountdown(countdown);

    const interval = setInterval(() => {
      countdown -= 1;
      setLogoutCountdown(countdown);

      if (countdown <= 0) {
        clearInterval(interval);
        setShowToast(false);
        setToastMessage("");
        setToastType(null);
        setLogoutCountdown(null);
      }
    }, 1000);
  };

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    if (isTokenExpired(token)) {
      console.warn("Token expired. Logging out...");
      setToastMessage("Session expired. Logging out...");
      setToastType("logout");
      setShowToast(true);
      setTimeout(() => {
        handleLogout();
      }, 4000);
      return;
    }

    setIsLoggedIn(true);

    fetchUserData(token);

    let idleTimeout: ReturnType<typeof setTimeout>;
    let countdownInterval: ReturnType<typeof setInterval>;

    const resetTimers = () => {
      clearTimeout(idleTimeout);
      clearInterval(countdownInterval);

      if (toastType === "idle" || toastType === "logout") {
        setShowToast(false);
        setLogoutCountdown(null);
      }

      idleTimeout = setTimeout(() => {
        if (token && isTokenExpired(token)) {
          setToastMessage("Session expired. Logging out...");
          setToastType("logout");
          setShowToast(true);
          setTimeout(() => {
            handleLogout();
          }, 4000);
        } else {
          setToastMessage("No activity. Logging out soon...");
          setToastType("idle");
          setShowToast(true);
          setLogoutCountdown(COUNTDOWN_DURATION);

          let countdown = COUNTDOWN_DURATION;
          countdownInterval = setInterval(() => {
            countdown -= 1;
            setLogoutCountdown(countdown);

            if (countdown <= 0) {
              clearInterval(countdownInterval);
              handleLogout();
            }
          }, 1000);
        }
      }, IDLE_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimers));
    resetTimers();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimers));
      clearTimeout(idleTimeout);
      clearInterval(countdownInterval);
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        setToken: updateToken,
        handleLogout,
        username,
        markAsRegistered,
      }}
    >
      {children}
      <Toast
        showToast={showToast && isLoggedIn}
        message={`${showToastMsg} ${logoutCountdown}`}
        logoutCountdownDuration={logoutCountdown ?? 0}
      />
    </AuthContext.Provider>
  );
};
