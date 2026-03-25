import clientApi from "..";
import { clearTokensCookies, getCookieByName, setTokenCookieByType } from "../../cookies";
import { AuthenticationResponse } from "./authentication.types";

export async function login(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const tokens = await clientApi.post<AuthenticationResponse>("/authentication/login", { email, password });

  setTokenCookieByType(tokens.accessToken, "access_token");
  setTokenCookieByType(tokens.refreshToken, "refresh_token");
console.log("tokens", tokens)
  return tokens;
}

export async function register(email: string, password: string, username: string) {
  const tokens = await clientApi.post<AuthenticationResponse>("/authentication/register", { email, password, username });

  setTokenCookieByType(tokens.accessToken, "access_token");
  setTokenCookieByType(tokens.refreshToken, "refresh_token");

  return tokens
}

export async function refreshAccessToken() {
  const refreshToken = await getCookieByName("refresh_token");
  const tokens = await clientApi.post<AuthenticationResponse>("/authentication/refresh-access-token", { refreshToken });

  setTokenCookieByType(tokens.accessToken, "access_token");

  return tokens
}

export async function logout() {
  await clientApi.post("/authentication/logout");

  await clearTokensCookies();
}
