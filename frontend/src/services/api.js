// src/services/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://fastfood-fapu.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Interceptor request -> adjunta access token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Cliente separado para refresh (evita loops con interceptor)
const refreshClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// Interceptor response -> detecta 401 y trata de refrescar
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // si 401 y no hemos reintentado
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        // no hay refresh -> logout (frontend)
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // cola para esperar al refresh actual
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const r = await refreshClient.post("/api/token/refresh/", { refresh: refreshToken });
        const newAccess = r.data.access;
        localStorage.setItem("access_token", newAccess);
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = "Bearer " + newAccess;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helpers (endpoints según tu backend)
export const registerUser = (payload) => api.post("/api/auth/register/", payload);
export const loginUser = async (payload) => {
  // La vista TokenObtainPair devuelve { access, refresh }
  const res = await api.post("/api/login/", payload);
  if (res.data.access) localStorage.setItem("access_token", res.data.access);
  if (res.data.refresh) localStorage.setItem("refresh_token", res.data.refresh);
  return res;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export default api;
