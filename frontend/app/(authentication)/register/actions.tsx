"use server";

import api from "@/lib/api/client";
import { cookies } from "next/headers";

interface RegisterResponse {
  accessToken: string;
}

export async function register(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  const response = await api.post<RegisterResponse>("/authentication/register", { email, password, username });

  const cookieStore = await cookies()
    cookieStore.set("access_token", response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
}
