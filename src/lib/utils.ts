import axios from "axios";
import { getToken } from "@/actions/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function request() {
  const token = await getToken();
  if (!token) {
    return axios.create({ validateStatus: () => true });
  }

  return axios.create({
    validateStatus: () => true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
