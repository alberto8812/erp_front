import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3009";

export class AuthenticationError extends Error {
  constructor(message = "Session expired") {
    super(message);
    this.name = "AuthenticationError";
  }
}

interface ApiOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

export async function apiClient<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const session = await auth();

  if (session?.error === "RefreshTokenError") {
    throw new AuthenticationError();
  }

  const token = session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    throw new AuthenticationError();
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      // Handle class-validator array of messages
      if (Array.isArray(body.message)) {
        message = body.message.join(", ");
      } else {
        message = body.message ?? body.error ?? message;
      }
      // Append statusCode if available
      if (body.statusCode && body.statusCode !== res.status) {
        message = `[${body.statusCode}] ${message}`;
      }
    } catch {
      // response wasn't JSON
    }
    console.error(`[API Error] ${res.status} ${res.url}: ${message}`);
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
