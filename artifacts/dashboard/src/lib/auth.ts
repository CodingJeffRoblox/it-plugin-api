import { create } from 'zustand';

interface AuthState {
  apiKey: string | null;
  role: 'admin' | 'staff' | null;
  setApiKey: (key: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  apiKey: localStorage.getItem('apiKey'),
  role: (localStorage.getItem('role') as 'admin' | 'staff' | null) || null,
  setApiKey: (key) => {
    localStorage.setItem('apiKey', key);
    set({ apiKey: key });
  },
  logout: () => {
    localStorage.removeItem('apiKey');
    localStorage.removeItem('role');
    set({ apiKey: null, role: null });
  },
}));
