"use server";

import { BASIC_API_URL, SIGNED_URL_API_PATH } from "@/lib/consts";
import { request } from "@/lib/utils";

/**
 * Возвращает трек с автором
 *
 * @param slug - Slug трека
 * @returns Action Response с информацией по треку (включая автора). Трек может быть undefined, если трек не найден / к нему закрыт доступ
 */

export async function getTrackBySlug(
  slug: string,
): Promise<ActionResponse & { track?: Track }> {
  const route = BASIC_API_URL + "track/" + slug;
  const client = await request();
  const response = await client.get<Track>(route);

  if (response.status !== 200) {
    return {
      ok: false,
      status: response.status,
      message: "Ошибка!",
      track: undefined,
    };
  }

  return { ok: true, status: response.status, track: response.data };
}

/**
 * Возвращает подписанные ссылки по slug
 *
 * @param slug - Slug выбранного трека
 * @returns Action response и подписанные ссылки на файлы обложки и аудиофайла
 */
export async function getSignedUrlsBySlug(
  slug: string,
): Promise<
  ActionResponse & { trackSignedUrl?: string; imageSignedUrl?: string }
> {
  const trackRoute = BASIC_API_URL + "file/track/" + slug;
  const imageRoute = BASIC_API_URL + "file/image/" + slug;

  const client = await request();

  try {
    const [trackResponse, imageResponse] = await Promise.all([
      client(trackRoute),
      client(imageRoute),
    ]);

    const urls = {
      trackSignedUrl: SIGNED_URL_API_PATH + trackResponse.data,
      imageSignedUrl: SIGNED_URL_API_PATH + imageResponse.data,
    };

    return { ok: true, status: 200, ...urls };
  } catch (error) {
    return { ok: true, status: 500, message: "Ошибка!" };
  }
}

/**
 * Фиксирует уникальное прослушивание выбранного трека
 *
 * @param slug - Slug выбранного трека
 * @returns Action Response
 */
export async function captureListen(slug: string): Promise<ActionResponse> {
  const client = await request();
  const route = BASIC_API_URL + "track/" + slug + "/listens";
  const result = await client.patch(route);
  if (result.status !== 204) {
    return { ok: false, status: result.status };
  }

  return { ok: true, status: 204 };
}
