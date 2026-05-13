/**
 * ViralForge AI — API Service Layer
 * Centralized Axios instance with JWT interceptors.
 * All API calls go through this module.
 *
 * REQUIRED ENV VARIABLE (Vercel):
 *   VITE_API_URL = https://viralforge-api-909u.onrender.com/api
 */

import axios from 'axios';

// ─── Base URL ────────────────────────────────────────────────
// Uses VITE_API_URL in production (Vercel), falls back to localhost for dev.
// IMPORTANT: The URL must include /api at the end.
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


// ─── Request Interceptor — Attach JWT Token ─────────────────
// Always attach the access_token for ALL users including Google auth.
// After a proper Google auth exchange, the stored token is a Django JWT,
// not the raw Google credential.

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ─── Response Interceptor — Handle 401 Token Refresh ────────

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt token refresh on 401, but only once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccess = res.data.access;
        localStorage.setItem('access_token', newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);

      } catch (refreshErr) {
        // Refresh failed — clear all auth state and force re-login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('auth_provider');
        localStorage.removeItem('credits');
        localStorage.removeItem('total_generations');
        window.location.href = '/auth';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);


// ─── Auth API ───────────────────────────────────────────────
// Routes match Django: config/urls.py → path('api/', include('vfbackend.urls'))
// vfbackend/urls.py → path('register/', ...), path('login/', ...) etc.

export const authAPI = {
  register: (data) => api.post('/api/register/', data),
  login: (data) => api.post('/api/login/', data),

  // Exchange a Google credential token for Django JWT tokens
  googleAuth: (credential) => api.post('/api/auth/google/', { credential }),
};


// ─── Generation API ─────────────────────────────────────────

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


// ─── Projects API ───────────────────────────────────────────

export const projectsAPI = {
  getAll: () => api.get('/projects/'),
  getById: (id) => api.get(`/projects/${id}/`),
  regenerate: (id) => api.post(`/projects/${id}/regenerate/`),
  regenerateThumbnails: (id) => api.post(`/projects/${id}/regenerate-thumbnails/`),
  getFavorites: () => api.get('/favorites/'),
  toggleFavorite: (id) => api.post(`/projects/${id}/favorite/`),
};


export default api;
