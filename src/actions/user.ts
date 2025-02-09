"use server";

import { BASIC_API_URL } from "@/lib/consts";
import axios from "axios";

enum Endpoints {
  GetUserBySlug = "user/",
}

export const getUserBySlug = async (slug: string): Promise<UserWithTracks | null> => {
  const route = BASIC_API_URL + Endpoints.GetUserBySlug + slug;
  const response = await axios.get<UserWithTracks>(route, {
    validateStatus: () => true,
  });

  if (response.status !== 200) {
    return null;
  }

  return response.data;
};
