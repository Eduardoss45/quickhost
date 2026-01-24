import axios from 'axios';
import { authStore } from '@/store/auth.store';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isBootstrapping = true;

export const setBootstrapped = () => {
  isBootstrapping = false;
};

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any) => {
  console.log('[AUTH] processQueue called. error =', error);

  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve();
  });

  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async error => {
    if (!error.response) {
      console.log('[AUTH] Network error:', error);
      return Promise.reject(error);
    }

    if (authStore.getState().sessionInvalidated) {
      console.warn('[AUTH] Session invalidated → blocking request');
      return Promise.reject(error);
    }

    const originalRequest = error.config as any;
    const status = error.response.status;
    const code = error.response?.data?.code;

    console.group('[AUTH INTERCEPTOR]');
    console.log('URL:', originalRequest.url);
    console.log('Status:', status);
    console.log('Code:', code);
    console.log('isRefreshing:', isRefreshing);
    console.log('_retry:', originalRequest._retry);
    console.log('sessionInvalidated:', authStore.getState().sessionInvalidated);
    console.groupEnd();

    const { sessionInvalidated, invalidateSession, clearUser } = authStore.getState();

    if (originalRequest.url?.includes('/api/auth/refresh')) {
      console.warn('[AUTH] Refresh endpoint failed → logout');
      invalidateSession();
      clearUser();
      window.location.replace('/login');
      return Promise.reject(error);
    }

    if (code === 'SESSION_REVOKED') {
      console.warn('[AUTH] Session revoked by backend');
      invalidateSession();
      clearUser();
      toast.warning('Sua sessão foi encerrada por outro login.');
      window.location.replace('/login');
      return Promise.reject(error);
    }

    if (sessionInvalidated && !isBootstrapping) {
      console.warn('[AUTH] Session already invalidated → skipping');
      return Promise.reject(error);
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      console.warn('[AUTH] Request already retried → logout');
      invalidateSession();
      clearUser();
      window.location.replace('/login');
      return Promise.reject(error);
    }

    if (isRefreshing) {
      console.log('[AUTH] Refresh in progress → adding to queue');

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        console.log('[AUTH] Retrying queued request:', originalRequest.url);
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    console.log('[AUTH] Starting refresh request');

    try {
      const refreshResponse = await api.post('/api/auth/refresh');
      console.log('[AUTH] Refresh success:', refreshResponse.status);

      processQueue(null);

      console.log('[AUTH] Retrying original request:', originalRequest.url);
      return api(originalRequest);
    } catch (err) {
      console.error('[AUTH] Refresh failed:', err);

      processQueue(err);
      invalidateSession();
      clearUser();
      window.location.replace('/login');

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
      console.log('[AUTH] Refresh flow finished');
    }
  }
);
