import React, { useState, useEffect } from "react";
import { fetchCurrentUser } from "../api/auth";
import Toast from "../components/common/Toast";
import { useNavigate } from "react-router-dom";
import { AuthProviderProps } from "../types/authTypes";
import { AuthContext } from "../hooks/useAuth";
import { isTokenExpired } from "../utils/isTokenExpired";
import { COUNTDOWN_DURATION, IDLE_TIMEOUT } from "../utils/constants";

// Create the AuthProvider to wrap the App and provide the context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);
  const [username, setUsername] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showToastMsg, setShowToastMsg] = useState("");
  const [logoutCountdown, setLogoutCountdown] = useState<number | null>(0);

  const navigate = useNavigate();

  // Update token state and localStorage when token changes
  const updateToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
    setIsLoggedIn(!!newToken);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    updateToken(null);
    setUsername("");
    setToken(null);
    navigate("/");
  };

  const triggerLogoutWithToast = (message: string) => {
    setShowToastMsg(message);
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

        if (authErrors.includes(error.message)) {
          triggerLogoutWithToast("Session expired. Logging out...");
        } else {
          console.warn("Non-auth error fetching user data:", error);
        }
      });
  };

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    if (isTokenExpired(token)) {
      console.warn("Token expired. Logging out...");
      setShowToastMsg("Session expired. Logging out...");
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
      setShowToast(false);
      setLogoutCountdown(null);

      idleTimeout = setTimeout(() => {
        if (token && isTokenExpired(token)) {
          setShowToastMsg("Session expired. Logging out...");
          setShowToast(true);
          setTimeout(() => {
            handleLogout();
          }, 4000);
        } else {
          setShowToastMsg("No activity. Logging out soon...");
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
