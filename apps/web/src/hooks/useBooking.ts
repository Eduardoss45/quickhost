import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { CreateBookingPayload, Booking } from '@/types';

export function useBooking() {
  const [loading, setLoading] = useState(false);

  const createBooking = async (payload: CreateBookingPayload) => {
    setLoading(true);
    try {
      const res = await api.post('/api/bookings', payload);
      toast.success('Reserva criada com sucesso');
      return res.data;
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Erro ao criar reserva');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const res = await api.post(`/api/bookings/${bookingId}/cancel`);
      toast.success('Reserva cancelada com sucesso');
      return res.data;
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Erro ao cancelar reserva');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const res = await api.post('/api/bookings/confirm', { bookingId });
      toast.success('Reserva confirmada com sucesso');
      return res.data;
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Erro ao confirmar reserva');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBookingsByAccommodation = async (accommodationId: string): Promise<Booking[]> => {
    try {
      const res = await api.get(`/api/bookings/accommodation/${accommodationId}`);
      return res.data;
    } catch {
      toast.error('Erro ao buscar reservas da acomodação');
      return [];
    }
  };

  const getUserBookings = async (): Promise<Booking[]> => {
    try {
      const res = await api.get('/api/bookings/user');
      return res.data;
    } catch {
      toast.error('Erro ao buscar suas reservas');
      return [];
    }
  };

  return {
    loading,
    createBooking,
    cancelBooking,
    confirmBooking,
    getBookingsByAccommodation,
    getUserBookings,
  };
}
