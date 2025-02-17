"use server";

import { BASIC_API_URL } from "@/lib/consts";
import { request } from "@/lib/utils";

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
