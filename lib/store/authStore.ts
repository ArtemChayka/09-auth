import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  fetchMe,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  updateUser as apiUpdateUser,
} from '@/lib/api';
import {
  User,
  LoginPayload,
  RegisterPayload,
  UpdateUserPayload,
} from '../../types/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (payload: UpdateUserPayload) => Promise<void>;
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
          console.error(error);
          set({ user: null, isAuthenticated: false });
        }
      },
      updateUser: async (payload) => {
        try {
          const updatedUser = await apiUpdateUser(payload);
          set({ user: updatedUser });
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
