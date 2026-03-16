import { create } from "zustand";
import type { Role } from "@/lib/auth/roles";

interface AuthUser {
  id: string;
  username: string;
  nama: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const { user } = await res.json();
        set({ user, isAuthenticated: true, isLoading: false });
      } else if (res.status === 401) {
        // Try silent refresh
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          const meRes = await fetch("/api/auth/me", { credentials: "include" });
          if (meRes.ok) {
            const { user } = await meRes.json();
            set({ user, isAuthenticated: true, isLoading: false });
            return;
          }
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Login gagal");
    }

    const { user } = await res.json();
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    set({ user: null, isAuthenticated: false });
  },
}));
