// FRONTEND/frontend/src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useContext(UserContext);
  const location = useLocation();

  if (error) {
    // You might want to redirect to an error page or show an error message
    return <div>An error occurred: {error.message}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin_login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
