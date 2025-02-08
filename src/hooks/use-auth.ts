import { create } from "zustand"
import { login, me } from "@/actions/auth";

interface UseAuth {
    user?: User
    isLoggedIn: boolean
    login: (email: string, password: string) => Promise<AuthActionResponse>
}

export const useAuth = create<UseAuth>((set) => ({
    user: undefined,
    isLoggedIn: false,

    async login(email: string, password: string) {
        const response = await login(email, password)
        if (!response.ok) {
            return response
        }
        const userData = await me();
        if (!userData) {
            return response;
        }

        set({ isLoggedIn: true })

        set({ user: userData });

        return { ok: true, status: 200, message: 'Вы авторизованы!' };
    },
}))