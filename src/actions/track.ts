"use server";

import { BASIC_API_URL } from "@/lib/consts";
import { request } from "./auth";

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

export async function uploadTrack(
  dto: UploadTrackDTO,
): Promise<ActionResponse & { slug?: string }> {
  const apiRoute = BASIC_API_URL + "track";
  const client = await request();

  const audioFileBuf = await dto.audioFile.arrayBuffer();
  const artworkFileBuf = await dto.artworkFile.arrayBuffer();

  const data = {
    ...dto,
    // audioFile: new Blob([dto.audioFile]),
    audioFile: Buffer.from(audioFileBuf),
    artworkFile: Buffer.from(artworkFileBuf),
    // artworkFile: new Blob([dto.artworkFile]),
  };

  const response = await client.post(apiRoute, dto, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  switch (response.status) {
    case 422:
      return {
        ok: false,
        message:
          "Форма заполнена некорректно. Обновите страницу и попробуйте заново",
        status: response.status,
      };
    case 401:
      return {
        ok: false,
        message:
          "Ошибка авторизации. Обновите страницу и заполните форму ещё раз.",
        status: response.status,
      };
    case 201:
      return {
        ok: true,
        message: "Трек успешно создан",
        status: 201,
        slug: response.data.slug,
      };
    default:
      return { ok: false, message: "Ошибка сервера", status: response.status };
  }
}
