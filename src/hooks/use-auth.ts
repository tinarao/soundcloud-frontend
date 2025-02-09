import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login, me } from "@/actions/auth";

interface UseAuth {
  user?: User;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<ActionResponse>;
  verify: () => Promise<void>;
}

export const useAuth = create<UseAuth>()(
  persist(
    (set) => ({
      user: undefined,
      isLoggedIn: false,

      async login(email: string, password: string) {
        const response = await login(email, password);
        if (!response.ok) {
          return response;
        }
        const userData = await me();
        if (!userData) {
          return response;
        }

        set({ isLoggedIn: true, user: userData });
        return { ok: true, status: 200, message: "Вы авторизованы!" };
      },

      async verify() {
        try {
          console.log("Verified!");
          const userData = await me();
          set({ isLoggedIn: true, user: userData });
        } catch {
          console.log("Unauthorized!");
          set({ isLoggedIn: false, user: undefined });
        }
      },
    }),
    {
      name: "auth",
    },
  ),
);
