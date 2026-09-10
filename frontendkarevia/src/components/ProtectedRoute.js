import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "./PageLoader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    // Sauvegarde l'URL pour rediriger après connexion
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return children;
}