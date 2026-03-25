const BASE_URL = typeof window === "undefined"
  ? process.env.API_URL              // server-side
  : process.env.NEXT_PUBLIC_API_URL; // client-side

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const route = `${BASE_URL}/api${path}`

  const result = await fetch(route, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!result.ok) {
    const error = await result.json();

    throw new Error(error.message);
  }

  return result.json();
}

const clientApi = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export default clientApi;
