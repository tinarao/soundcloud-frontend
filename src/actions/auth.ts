"use server";

import axios from "axios";
import { BASIC_API_URL } from "@/lib/consts";
import { cookies } from "next/headers";

type LoginApiResponse = {
  accessToken: string;
  refreshToken: string;
  message?: string;
};

enum Endpoints {
  Login = "auth/login",
  Me = "auth/me",
}

export async function login(
  email: string,
  password: string,
): Promise<ActionResponse> {
  const cookiesStore = await cookies();
  const route = BASIC_API_URL + Endpoints.Login;
  const response = await axios.post<LoginApiResponse>(
    route,
    {
      email,
      password,
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
