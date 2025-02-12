"use server";

import axios from "axios";
import { BASIC_API_URL } from "@/lib/consts";
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
  const response = await axios.post(
    route,
    {
      username: dto.username,
      email: dto.email,
      password: dto.password,
    },
    {
      validateStatus: () => true,
    },
  );

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
  const route = BASIC_API_URL + Endpoints.Login;
  const response = await axios.post<LoginApiResponse>(
    route,
    {
      email: dto.email,
      password: dto.password,
    },
    {
      validateStatus: () => true,
    },
  );

  if (response.status !== 200) {
    return {
      ok: false,
      status: response.status,
      message: response.data.message,
    };
  }

  cookiesStore.set("accessToken", response.data.accessToken);

  return { ok: true, status: response.status, message: response.data.message };
}

export async function me(): Promise<User> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("accessToken");
  if (!token) {
    throw new Error("No access token found in cookies");
  }

  const route = BASIC_API_URL + Endpoints.Me;
  const response = await axios.get<User>(route, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    validateStatus: () => true,
  });

  if (response.status !== 200) {
    throw new Error("Unauthorized");
  }

  return response.data;
}

export async function logout() {
  const cookieStorage = await cookies();
  cookieStorage.delete("accessToken");

  return redirect("/");
}
