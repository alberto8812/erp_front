import { auth } from "@/auth";
import { AuthenticationError } from "@/lib/api";

const IMPORT_API_URL =
  process.env.NEXT_PUBLIC_IMPORT_API_URL ?? "http://localhost:3003";

interface UploadOptions {
  headers?: Record<string, string>;
}

export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData,
  options: UploadOptions = {},
): Promise<T> {
  const session = await auth();

  if (session?.error === "RefreshTokenError") {
    throw new AuthenticationError();
  }

  const token = session?.access_token;

  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${IMPORT_API_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.status === 401) {
    throw new AuthenticationError();
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // response wasn't JSON
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function apiImport<T = unknown>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    responseType?: "json" | "blob" | "raw";
  } = {},
): Promise<T> {
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

  const res = await fetch(`${IMPORT_API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    throw new AuthenticationError();
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // response wasn't JSON
    }
    throw new Error(message);
  }

  // Handle different response types
  if (options.responseType === "blob") {
    return res.blob() as unknown as T;
  }

  if (options.responseType === "raw") {
    return res as unknown as T;
  }

  if (
    res.headers
      .get("content-type")
      ?.includes("application/vnd.openxmlformats")
  ) {
    return res as unknown as T;
  }

  return res.json() as Promise<T>;
}

export async function apiImportDownload(path: string): Promise<Blob> {
  const session = await auth();

  if (session?.error === "RefreshTokenError") {
    throw new AuthenticationError();
  }

  const token = session?.access_token;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${IMPORT_API_URL}${path}`, {
    method: "GET",
    headers,
  });

  if (res.status === 401) {
    throw new AuthenticationError();
  }

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  return res.blob();
}
