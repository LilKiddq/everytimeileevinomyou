import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';

  init: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  authModalOpen: false,
  authModalMode: 'login',

  init: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, user: data.session?.user || null, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        set({ session, user: session?.user || null, loading: false });
      })();
    });
  },

  signIn: async (email, password) => {
    set({ error: null, loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ error: error.message, loading: false });
      return;
    }
    set({ loading: false, authModalOpen: false, error: null });
  },

  signUp: async (email, password) => {
    set({ error: null, loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ error: error.message, loading: false });
      return;
    }
    set({ loading: false, authModalOpen: false, error: null });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  setAuthModalOpen: (open) => set({ authModalOpen: open, error: null }),
  setAuthModalMode: (mode) => set({ authModalMode: mode, error: null }),
  clearError: () => set({ error: null }),
}));
