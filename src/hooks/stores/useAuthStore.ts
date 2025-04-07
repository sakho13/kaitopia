import { User } from "firebase/auth"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthState = {
  user: User | null
  idToken: string | null
  setAuth: (user: AuthState["user"], idToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      idToken: null,
      setAuth: (user, idToken) => set({ user, idToken }),
      clearAuth: () => set({ user: null, idToken: null }),
    }),
    {
      name: "auth-storage-kaitopia",
    },
  ),
)
