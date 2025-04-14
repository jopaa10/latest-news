import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentUser } from "../api/auth";
import Toast from "../components/common/Toast";
import { useNavigate } from "react-router-dom";
import { AuthContextType, AuthProviderProps } from "../types";

const IDLE_TIMEOUT = 60 * 60 * 1000;
const COUNTDOWN_DURATION = 10;

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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

  const fetchUserData = (token: string) => {
    fetchCurrentUser(token)
      .then((data) => {
        if (data && data.name) {
          setUsername(data.name);
        }
      })
      .catch((error) => {
        if (
          error.message === "Unauthorized" ||
          error.message === "UserNotFound" ||
          error.message === "Forbidden"
        ) {
          setShowToastMsg("Session expired. Logging out...");
          setShowToast(true);

          // Delay logout until toast disappears (e.g., after 4s)
          setTimeout(() => {
            handleLogout();
          }, 4000);
        } else {
          console.warn("Non-auth error fetching user data:", error);
        }
      });
  };

  useEffect(() => {
    let idleTimeout: ReturnType<typeof setTimeout>;
    let countdownInterval: ReturnType<typeof setInterval>;

    const resetTimers = () => {
      clearTimeout(idleTimeout);
      clearInterval(countdownInterval);
      setShowToast(false);
      setLogoutCountdown(null);

      // Wait 1 minute of inactivity before starting the countdown
      idleTimeout = setTimeout(() => {
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
      }, IDLE_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimers));

    // Initialize
    resetTimers();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimers));
      clearTimeout(idleTimeout);
      clearInterval(countdownInterval);
    };
  }, []);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    } else {
      setIsLoggedIn(false);
    }
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
