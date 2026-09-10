import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 15000,
});

// Injecte le token JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gère les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/connexion";
    }
    return Promise.reject(error);
  }
);

export default api;