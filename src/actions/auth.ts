"use server";

import { ACCESS_TOKEN_NAME, BASIC_API_URL } from "@/lib/consts";
import { request } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginApiResponse = {
  accessToken: string;
  refreshToken: string;
  message?: string;
};

enum Endpoints {
  Login = "auth/login",
  Me = "auth/me",
  Register = "auth/register",
}

export async function register(dto: RegisterDTO): Promise<ActionResponse> {
  const route = BASIC_API_URL + Endpoints.Register;
  const client = await request();
  const response = await client.post(route, {
    username: dto.username,
    email: dto.email,
    password: dto.password,
  });

  switch (response.status) {
    case 422:
      return {
        ok: false,
        status: response.status,
        message: "Форма заполнена некорректно!",
      };
    case 400:
      return {
        ok: false,
        status: response.status,
        message:
          "Пользователь с таким псевдонимом и/или адресом электронной почты уже существует",
      };
    case 200:
      return {
        ok: true,
        status: response.status,
        message: "Вы успешно зарегистрировались!",
      };
    default:
      return {
        ok: false,
        status: 500,
        message: "Возникла неизвестная ошибка, попробуйте позже",
      };
  }
}

export async function login(dto: LoginDTO): Promise<ActionResponse> {
  const cookiesStore = await cookies();
  const client = await request();
  const route = BASIC_API_URL + Endpoints.Login;
  const response = await client.post<LoginApiResponse>(route, {
    email: dto.email,
    password: dto.password,
  });

  if (response.status !== 200) {
    return {
      ok: false,
      status: response.status,
      message: response.data.message,
    };
  }

  cookiesStore.set(ACCESS_TOKEN_NAME, response.data.accessToken);

  return { ok: true, status: response.status, message: response.data.message };
}

export async function me(): Promise<User | null> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(ACCESS_TOKEN_NAME);
  if (!token) {
    return null;
  }

  const route = BASIC_API_URL + Endpoints.Me;
  const client = await request();
  const response = await client.get<User>(route);

  if (response.status !== 200) {
    return null;
  }

  return response.data;
}

export async function logout() {
  const cookieStorage = await cookies();
  cookieStorage.delete(ACCESS_TOKEN_NAME);

  return redirect("/");
}

//

export async function getToken() {
  const cookieStorage = await cookies();
  const token = cookieStorage.get(ACCESS_TOKEN_NAME);
  if (!token) {
    return null;
  }

  return token.value;
}
