import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [token, setToken]         = useState(() => localStorage.getItem("token"));
  const [role, setRole]           = useState(() => localStorage.getItem("role"));
  const [loading, setLoading]     = useState(true);

  // Vérifie le token au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) { setLoading(false); return; }
      try {
        const { data } = await api.get("/user");
        setUser(data);
        setRole(data.role);
        localStorage.setItem("role", data.role);
      } catch {
        // Token expiré ou invalide
        logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/login", credentials);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    setToken(data.token);
    setUser(data.user);
    setRole(data.user.role);
    return data.user;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await api.post("/register", formData);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    setToken(data.token);
    setUser(data.user);
    setRole(data.user.role);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post("/logout"); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
    setRole(null);
  }, []);

  const updateUser = useCallback((newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      user, token, role, loading,
      isAuthenticated,
      login, register, logout, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}