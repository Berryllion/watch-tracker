import { cookies } from "next/headers";

const token = typeof window === "undefined"
  ? (await cookies()).get("access_token")?.value
  : null

export default token;
