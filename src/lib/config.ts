const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

export const API_BASE_URL =
  env.VITE_API_BASE_URL ?? env.API_BASE_URL ?? "http://0.0.0.0:8200";
