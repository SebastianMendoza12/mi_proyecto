// src/services/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
console.log("API Base URL:", API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Interceptor request -> adjunta access token si existe
api.interceptors.request.use(
  (config) => {
    // Lista de rutas que NO necesitan token
    const publicRoutes = ['/api/auth/register/', '/api/auth/login/', '/api/login/', '/api/productos/', '/api/categorias/'];
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));

    // Solo agrega el token si NO es una ruta pública
    if (!isPublicRoute) {
      const token = localStorage.getItem("access_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

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
    // Lista de rutas públicas que NO deben intentar refrescar token
    const publicRoutes = ['/api/auth/register/', '/api/auth/login/', '/api/login/', '/api/productos/', '/api/categorias/'];
    const isPublicRoute = publicRoutes.some(route => originalRequest.url?.includes(route));

    // Si es ruta pública, no intentar refrescar token
    if (isPublicRoute) {
      return Promise.reject(error);
    }
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


// ========== AUTENTICACIÓN ==========
export const register = (data) => api.post("/api/usuarios/register/", data);

export const login = (data) => api.post("/api/usuarios/login/", data);

export const adminLogin = (data) => api.post("/api/usuarios/admin-login/", data);

export const verifyCode = (data) => api.post("/api/usuarios/verify-code/", data);

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("username");
};

// ========== PRODUCTOS (PUBLIC) ==========
export const getProductos = (params = {}) => api.get("/api/productos/", { params });

export const getProducto = (id) => api.get(`/api/productos/${id}/`);

export const calificarProducto = (id, calificacion) =>
  api.post(`/api/productos/${id}/calificar/`, { calificacion });

// ========== PRODUCTOS (ADMIN) ==========
export const getAdminProductos = (params = {}) => api.get("/api/admin/productos/", { params });

export const getAdminProducto = (id) => api.get(`/api/admin/productos/${id}/`);

export const createAdminProducto = (data) => api.post("/api/admin/productos/", data);

export const updateAdminProducto = (id, data) => api.put(`/api/admin/productos/${id}/`, data);

export const deleteAdminProducto = (id) => api.delete(`/api/admin/productos/${id}/`);

// ========== CATEGORIAS ==========
export const getCategorias = (params = {}) => api.get("/api/categorias/", { params });

export const getCategoria = (id) => api.get(`/api/categorias/${id}/`);

export default api;
