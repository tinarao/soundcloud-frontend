"use server";

import { BASIC_API_URL } from "@/lib/consts";
import { cookies } from "next/headers";
import { request } from "./auth";

enum Endpoints {
  create = "subscription/",
  remove = "subscription/",
}

export async function createSubscription(
  userToBeSubscribedToId: number,
): Promise<ActionResponse> {
  const cookiesStorage = await cookies();
  const accessToken = cookiesStorage.get("accessToken");

  if (userToBeSubscribedToId === 0 || !accessToken) {
    return { ok: false, message: "Некорректный запрос", status: 400 };
  }

  const route = BASIC_API_URL + Endpoints.create + userToBeSubscribedToId;
  const client = await request();

  const res = await client.post(route, {});

  switch (res.status) {
    case 404:
      return { ok: false, message: "Польователь не найден", status: 404 };
    case 401:
      return { ok: false, message: "Ошибка авторизации", status: 401 };
    case 400:
      return {
        ok: false,
        message: `Вы уже подписаны на этого пользователя`,
        status: 400,
      };
    case 204:
      return { ok: true, message: "Успешно!", status: 204 };
    default:
      return {
        ok: false,
        message:
          "Непредвиденная ошибка сервера. Обновите страницу и попробуйте снова",
        status: 500,
      };
  }
}

export async function removeSubscription(
  userToBeUnubscribedFromId: number,
): Promise<ActionResponse> {
  const cookiesStorage = await cookies();
  const accessToken = cookiesStorage.get("accessToken");

  if (userToBeUnubscribedFromId === 0 || !accessToken) {
    return { ok: false, message: "Некорректный запрос", status: 400 };
  }

  const route = BASIC_API_URL + Endpoints.remove + userToBeUnubscribedFromId;
  const client = await request();

  const res = await client.delete(route, {
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
    validateStatus: () => true,
  });

  switch (res.status) {
    case 404:
      return { ok: false, message: "Польователь не найден", status: 404 };
    case 401:
      return { ok: false, message: "Ошибка авторизации", status: 401 };
    case 400:
      return {
        ok: false,
        message: `Вы не подписаны на этого пользователя`,
        status: 400,
      };
    case 204:
      return { ok: true, message: "Успешно!", status: 204 };
    default:
      return {
        ok: false,
        message:
          "Непредвиденная ошибка сервера. Обновите страницу и попробуйте снова",
        status: 500,
      };
  }
}
