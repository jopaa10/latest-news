import React from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC<RouteProps> = ({ element }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
