import { create } from 'zustand';
import { User, LoginPayload, RegisterPayload } from '../../types/users';
import {
  fetchMe,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from '@/lib/api';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (payload) => {
        try {
          const user = await apiLogin(payload);
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },
      register: async (payload) => {
        try {
          const user = await apiRegister(payload);
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },
      logout: async () => {
        try {
          await apiLogout();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          throw error;
        }
      },
      checkAuth: async () => {
        try {
          const user = await fetchMe();
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
