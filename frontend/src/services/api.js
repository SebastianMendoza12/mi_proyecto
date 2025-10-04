import axios from "axios";

// Usa la URL del backend (Render) desde tu .env.local o las variables de Vercel
const API_BASE = import.meta.env.VITE_API_URL || "https://fastfood-fapu.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Si el usuario ya tiene un token, se agrega automáticamente a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => api.post("/api/auth/register/", data);
export const loginUser = (data) => api.post("/api/login/", data);

export default api;
