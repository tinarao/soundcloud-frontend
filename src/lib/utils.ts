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

export const secondsToMinutes = (seconds: number) => {
  let minutes = Math.floor(seconds / 60);
  let secondsLeft: number | string = seconds % 60;
  if (secondsLeft < 10) {
    secondsLeft = `0${secondsLeft}`;
  }
  return `${minutes}:${secondsLeft}`;
};
