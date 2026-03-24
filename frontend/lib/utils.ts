import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const EMAIL_PLACEHOLDER = "email@example.com";
export const PASSWORD_PLACEHOLDER = "••••••••••••";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateEmail = (email: string) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailToTest = String(email).toLowerCase();

  return emailRegex.test(emailToTest);
};
