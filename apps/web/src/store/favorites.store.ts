import { api } from '@/services/api';
import { toast } from 'sonner';
import { create } from 'zustand';

type FavoritesState = {
  favorites: string[];
  loading: boolean;

  setFavorites: (ids: string[]) => void;
  clearFavorites: () => void;

  fetchFavorites: () => Promise<void>;
  addFavorite: (accommodationId: string) => Promise<void>;
  removeFavorite: (accommodationId: string) => Promise<void>;
  isFavorited: (accommodationId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loading: false,

  setFavorites: ids => set({ favorites: ids }),
  clearFavorites: () => set({ favorites: [] }),

  async fetchFavorites() {
    set({ loading: true });
    try {
      const res = await api.get<string[]>('/api/user/favorites');

      set({ favorites: res.data });
    } finally {
      set({ loading: false });
    }
  },

  async addFavorite(accommodationId) {
    set({ loading: true });

    try {
      await api.post(`/api/user/favorites/${accommodationId}`);

      await get().fetchFavorites();

      toast.success('Adicionado aos favoritos');
    } catch (error) {
      toast.error('Não foi possível adicionar aos favoritos');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  async removeFavorite(accommodationId: string) {
    set({ loading: true });

    try {
      const res = await api.delete<{ success: boolean; message: string; accommodationId: string }>(
        `/api/user/favorites/${accommodationId}`
      );

      set(state => ({
        favorites: state.favorites.filter(id => id !== res.data.accommodationId),
      }));

      toast.success(res.data.message);
    } catch (error) {
      toast.error('Não foi possível remover dos favoritos');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  isFavorited(accommodationId) {
    return get().favorites.includes(accommodationId);
  },
}));
