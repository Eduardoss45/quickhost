import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  userId: any;
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
  sessionInvalidated: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;
  setHydrated: () => void;
  invalidateSession: () => void;
  restoreSession: () => void;
};

export const authStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      hydrated: false,
      sessionInvalidated: false,

      setUser: user => set({ user }),
      clearUser: () => set({ user: null }),
      setHydrated: () => set({ hydrated: true }),
      invalidateSession: () => set({ user: null, sessionInvalidated: true, hydrated: true }),
      restoreSession: () => set({ sessionInvalidated: false }),
    }),
    {
      name: 'auth-store',
      partialize: state => ({
        user: state.user,
        sessionInvalidated: state.sessionInvalidated,
      }),
    }
  )
);
