import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  email: string;
  username: string;

  social_name?: string | null;
  cpf?: string | null;
  birth_date?: string | null;
  phone_number?: string | null;

  profile_picture_url?: string | null;
  created_at?: string;
};

type AuthState = {
  user: User | null;
  hydrated: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;
  setHydrated: () => void;
};

export const authStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      hydrated: false,

      setUser: user => set({ user }),
      clearUser: () => set({ user: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'auth-store',
      partialize: state => ({ user: state.user }),
    }
  )
);
