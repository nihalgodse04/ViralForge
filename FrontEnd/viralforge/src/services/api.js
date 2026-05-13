/**
 * ViralForge AI — API Service Layer
 * Centralized Axios instance with JWT interceptors.
 * All API calls go through this module.
 */

import axios from 'axios';

const API_BASE_URL = 'viral-forge-nihalgodse04-2249s-projects.vercel.app';

// ─── Axios Instance ─────────────────────────────────────────

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


// ─── Request Interceptor — Attach JWT Token ─────────────────

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        'access_token'
      );

    const provider =
      localStorage.getItem(
        'auth_provider'
      );

    // Google demo auth:
    // do NOT attach fake JWT
    if (provider === "google") {
      return config;
    }

    // Normal JWT auth
    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
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

    // If 401 and we haven't retried yet, try refreshing the token
    if (

      error.response?.status === 401 &&

      !originalRequest._retry &&

      localStorage.getItem("auth_provider") !== "google"

    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccess = res.data.access;
        localStorage.setItem('access_token', newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshErr) {
        // Refresh failed — clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.setItem("auth_provider", "local");
        window.location.href = '/auth';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);


// ─── Auth API ───────────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post('/register/', data),
  login: (data) => api.post('/login/', data),
};


// ─── Generation API ─────────────────────────────────────────

export const generateAPI = {
  generate: (data) => api.post('/generate/', data),
};


// ─── Generation API ─────────────────────────────────────────

export const userAPI = {

  getCredits: () =>
    api.get('/user/credits/'),

};

// ─── Dashboard API ───────────────────────────────────────────

export const dashboardAPI = {

  getStats: () => api.get('/dashboard/stats/'),

};


// ─── Projects API ───────────────────────────────────────────

export const projectsAPI = {

  getAll: () => api.get('/projects/'),

  getById: (id) => api.get(`/projects/${id}/`),

  regenerate: (id) =>
    api.post(`/projects/${id}/regenerate/`),

  regenerateThumbnails: (id) =>
    api.post(`/projects/${id}/regenerate-thumbnails/`),

  getFavorites: () => api.get('/favorites/'),

  toggleFavorite: (id) => api.post(`/projects/${id}/favorite/`),

};


export default api;
