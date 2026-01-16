import axios from 'axios';
import { authStore } from '@/store/auth.store';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const code = error.response?.data?.code;

    const { sessionInvalidated, invalidateSession, clearUser } = authStore.getState();

    // 🚫 nunca interceptar refresh
    if (originalRequest.url?.includes('/api/auth/refresh')) {
      return Promise.reject(error);
    }

    // 🚨 sessão revogada pelo backend
    if (code === 'SESSION_REVOKED') {
      invalidateSession();
      toast.warning('Sua sessão foi encerrada por outro login.');
      window.location.replace('/login');
      return Promise.reject(error);
    }

    // ❌ sessão já invalidada → não tenta refresh
    if (sessionInvalidated) {
      return Promise.reject(error);
    }

    // erro normal
    if (status !== 401) {
      return Promise.reject(error);
    }

    // evita loop
    if (originalRequest._retry || isRefreshing) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post('/api/auth/refresh');
      isRefreshing = false;
      return api(originalRequest);
    } catch (err) {
      isRefreshing = false;
      invalidateSession();
      clearUser();
      window.location.replace('/login');
      return Promise.reject(err);
    }
  }
);
