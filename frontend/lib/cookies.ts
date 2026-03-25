"use server"

import { cookies } from "next/headers";

type TokenType = "access_token" | "refresh_token";

const maxAge: Record<TokenType, number> = {
  access_token: 60 * 15, // 15min
  refresh_token: 60 * 60 * 24 * 30, // 30 days
};

export const getCookieByName = async (type: TokenType) => {
  const cookieStore = await cookies();

  return cookieStore.get(type)?.value;
};

export const setTokenCookieByType = async (token: string, type: TokenType) => {
  const cookieStore = await cookies();

  cookieStore.set(type, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge[type],
  });
};

export const clearTokensCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
};
