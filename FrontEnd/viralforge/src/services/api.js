/**
 * ViralForge AI — API Service Layer
 * Centralized Axios instance with JWT interceptors.
 *
 * REQUIRED ENV VARIABLES:
 *   Vercel:  VITE_API_URL = https://viralforge-api-909u.onrender.com/api
 *   Local:   Automatically falls back to http://localhost:8000/api
 *
 * IMPORTANT: baseURL already contains /api — do NOT prefix endpoints with /api/
 */

import axios from 'axios';

// ─── Base URL ────────────────────────────────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api';

// ─── Axios Instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


// ─── Request Interceptor — Attach JWT Bearer Token ───────────
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ─── Response Interceptor — Handle 401 + Token Refresh ───────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // Use raw axios (not the intercepted instance) to avoid infinite loop
        const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccess = res.data.access;
        sessionStorage.setItem('access_token', newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);

      } catch {
        // Refresh failed — clear everything and redirect to login
        sessionStorage.clear();
        window.location.href = '/auth';
        return Promise.reject(error);
      }
    }

    // 401 on non-retry requests: clear session state
    if (error.response?.status === 401) {
      sessionStorage.clear();
    }

    return Promise.reject(error);
  }
);


// ─── Auth API ─────────────────────────────────────────────────
// baseURL = .../api  →  full path = .../api/register/
export const authAPI = {
  register: (data) => api.post('/register/', data),
  login: (data) => api.post('/login/', data),
  googleAuth: (credential) => api.post('/auth/google/', { credential }),
};


// ─── Generation API ──────────────────────────────────────────
export const generateAPI = {
  generate: (data) => api.post('/generate/', data),
};


// ─── User API ────────────────────────────────────────────────
export const userAPI = {
  getCredits: () => api.get('/user/credits/'),
};


// ─── Dashboard API ───────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats/'),
};


// ─── Projects API ────────────────────────────────────────────
export const projectsAPI = {
  getAll: () => api.get('/projects/'),
  getById: (id) => api.get(`/projects/${id}/`),
  regenerate: (id) => api.post(`/projects/${id}/regenerate/`),
  regenerateThumbnails: (id) => api.post(`/projects/${id}/regenerate-thumbnails/`),
  getFavorites: () => api.get('/favorites/'),
  toggleFavorite: (id) => api.post(`/projects/${id}/favorite/`),
};


export default api;
