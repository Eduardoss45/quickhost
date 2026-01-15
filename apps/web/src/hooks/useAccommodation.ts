import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Accommodation, CreateAccommodationPayload, UpdateAccommodationPayload } from '@/types';

export function useAccommodation() {
  const [loading, setLoading] = useState(false);

  const getAll = async (): Promise<Accommodation[]> => {
    try {
      const res = await api.get('/api/accommodations');
      return res.data;
    } catch {
      toast.error('Erro ao buscar acomodações');
      return [];
    }
  };

  const getMyRecords = async (): Promise<Accommodation[]> => {
    try {
      const res = await api.get('/api/accommodations/my-records');
      return res.data;
    } catch {
      toast.error('Erro ao buscar suas acomodações');
      return [];
    }
  };

  const getById = async (id: string): Promise<Accommodation | null> => {
    try {
      const res = await api.get(`/api/accommodations/${id}`);
      return res.data;
    } catch {
      toast.error('Acomodação não encontrada');
      return null;
    }
  };

  const create = async (payload: CreateAccommodationPayload) => {
    setLoading(true);
    try {
      await api.post('/api/accommodations', payload);
      toast.success('Acomodação criada com sucesso');
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Erro ao criar acomodação');
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, payload: FormData) => {
    setLoading(true);
    try {
      await api.patch(`/api/accommodations/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Acomodação atualizada com sucesso');
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Erro ao atualizar acomodação');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/api/accommodations/${id}`);
      toast.success('Acomodação removida com sucesso');
    } catch {
      toast.error('Erro ao remover acomodação');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAll,
    getMyRecords,
    getById,
    create,
    update,
    remove,
  };
}
