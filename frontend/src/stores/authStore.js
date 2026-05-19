import { create } from 'zustand';

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),

  setAuth: (accessToken, user = null) => {
    localStorage.setItem('accessToken', accessToken);
    set({ accessToken, user, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    set({ accessToken: null, user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
