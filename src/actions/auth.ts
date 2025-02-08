"use server"

import { BASIC_API_URL } from "@/lib/consts"
import axios from "axios"
import { cookies } from 'next/headers'

type LoginApiResponse = {
    accessToken: string,
    refreshToken: string,
    message?: string
}

type AuthActionResponse = {
    ok: boolean,
    status: number,
    message?: string
}

enum Endpoints {
    Login = 'auth/login',
    Me = 'auth/me'
}
export async function login(email: string, password: string): Promise<AuthActionResponse> {
    const cookiesStore = await cookies();
    const route = BASIC_API_URL + Endpoints.Login
    const response = await axios.post<LoginApiResponse>(route, {
        email,
        password
    })

    if (response.status !== 200) {
        return { ok: false, status: response.status, message: response.data.message }
    }

    cookiesStore.set('accessToken', response.data.accessToken)

    return { ok: true, status: response.status, message: response.data.message }
}

export async function me() {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('accessToken');
    if (!token) {
        throw new Error('No access token found in cookies');
    }

    const route = BASIC_API_URL + Endpoints.Me;
    const response = await axios.get(route, {
        headers: {
            Authorization: `Bearer ${token.value}`
        },
    });

    console.log(response.data)
}
