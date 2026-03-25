"use server";

import { register } from "@/lib/api/authentication";

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  await register(email, password, username)
}
