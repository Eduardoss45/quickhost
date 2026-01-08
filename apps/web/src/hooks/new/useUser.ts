import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { authStore } from '@/store/auth.store';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

export function useUser() {
  const { user, setUser, clearUser, hydrated, setHydrated } = authStore();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const bootstrapSession = async () => {
    try {
      const res = await api.get('/api/auth/refresh');
      setUser(res.data.user);
    } catch {
      clearUser();
    } finally {
      setHydrated();
    }
  };

  const register = async (data: RegisterPayload) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', data);

      // ! Testes
      console.log('Resposta do registro:', res.data);

      setUser(res.data.user);
      toast.success('Registro realizado com sucesso!');
      navigate('/');
    } catch (e: any) {
      // ! Testes
      console.log('Resposta do registro:', e.response?.data);

      toast.error(e.response?.data?.message ?? 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginPayload) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', data);

      setUser(res.data.user);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api;
    if (!hydrated) return;

    const pathname = location.pathname;

    if (pathname !== '/login' && pathname !== '/register' && !user) {
      toast.warning('Por favor, faça login para continuar.');
      navigate('/login');
    }
  }, [hydrated, user]);

  return {
    user,
    loading,
    hydrated,
    login,
    register,
    bootstrapSession,
    isAuthenticated: !!user,
  };
}
