import { create } from "zustand"
import { login } from "@/actions/auth";

interface UseAuth {
    user?: User
    isLoggedIn: boolean
    login: (email: string, password: string) => Promise<boolean>
}

export const useAuth = create<UseAuth>((set) => ({
    user: undefined,
    isLoggedIn: false,

    async login(email: string, password: string) {
        const response = await login(email, password)
        if (response.ok) {
            set({ isLoggedIn: true })
        }

        return true;
    },
}))