"use server";

import { BASIC_API_URL, SIGNED_URL_API_PATH } from "@/lib/consts";
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

/**
 * Retrieves signed URLs for a track and image associated with a given slug.
 *
 * @param slug - The unique identifier for the track.
 * @returns Action response with signed URLs for the audio file and image.
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
