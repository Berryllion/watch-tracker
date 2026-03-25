"use server";

import { login } from "@/lib/api/authentication";
import { redirect } from "next/navigation";

export async function loginAction(_initialState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await login(email, password)

    redirect("/test")
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return "Login failed"
  }
}
