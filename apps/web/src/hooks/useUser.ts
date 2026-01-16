import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { authStore } from '@/store/auth.store';
import { PublicUser, UpdateUserPayload } from '@/types';
import { setBootstrapped } from '@/services/api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  cpf: string;
  birth_date: string;
}

export function useUser() {
  const { user, setUser, clearUser, hydrated, setHydrated } = authStore();
  const [loading, setLoading] = useState(false);

  const hasWarnedRef = useRef(false);
  const navigate = useNavigate();

  const getProfile = async () => {
    setLoading(true);

    try {
      const res = await api.get('/api/user');
      setUser(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload: UpdateUserPayload, file?: File) => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value as string);
        }
      });

      if (file) {
        formData.append('file', file);
      }

      await api.patch('/api/user/update', formData);
      await getProfile();

      toast.success('Perfil atualizado com sucesso');
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  async function removeProfilePicture() {
    setLoading(true);
    try {
      await api.delete('/api/user/profile-picture');
      await getProfile();
    } finally {
      setLoading(false);
    }
  }

  const getPublicUser = useCallback(async (userId: string) => {
    try {
      const res = await api.get<PublicUser>(`/api/user/${userId}`);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  const bootstrapSession = async () => {
    try {
      const res = await api.get('/api/user');
      setUser(res.data);

      // sessão válida → desbloqueia store
      authStore.getState().restoreSession();
    } catch {
      // se falhar, aí sim marca como inválida
      authStore.getState().invalidateSession();
    } finally {
      setHydrated();
      setBootstrapped(); // 🔥 libera o interceptor para funcionar normalmente
    }
  };

  const register = async (data: RegisterPayload) => {
    setLoading(true);
    try {
      await api.post('/api/auth/register', data);
      await getProfile();
      toast.success('Registro realizado com sucesso!');
      navigate('/');
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginPayload) => {
    setLoading(true);
    try {
      await api.post('/api/auth/login', data);
      await getProfile();
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
    } finally {
      clearUser();
      navigate('/');
    }
  };

  useEffect(() => {
    if (!hydrated) return;

    if (!user && !hasWarnedRef.current) {
      hasWarnedRef.current = true;
      toast.warning('Algumas funcionalidades exigem login.');
    }
  }, [hydrated, user]);

  return {
    user,
    loading,
    hydrated,
    getProfile,
    updateProfile,
    removeProfilePicture,
    getPublicUser,
    login,
    register,
    logout,
    bootstrapSession,
    isAuthenticated: !!user,
  };
}
