import { create } from 'zustand';
import { User } from '../../types/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void; // ← Цей метод має існувати
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }), // ← Переконайтесь що він тут є
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
