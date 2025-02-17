"use server";

import { BASIC_API_URL } from "@/lib/consts";
import { request } from "@/lib/utils";

enum Endpoints {
  GetUserBySlug = "user/",
}

export const getUserBySlug = async (slug: string): Promise<User | null> => {
  const route = BASIC_API_URL + Endpoints.GetUserBySlug + slug;
  const client = await request();
  const response = await client.get<User>(route, {
    validateStatus: () => true,
  });

  if (response.status !== 200) {
    return null;
  }

  return response.data;
};
