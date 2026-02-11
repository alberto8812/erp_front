"use server";

import { auth } from "@/auth";
import { AuthenticationError } from "@/lib/api";
import type { RowError } from "./upload-preview.action";

const IMPORT_API_URL =
  process.env.NEXT_PUBLIC_IMPORT_API_URL ?? "http://localhost:3003";

export interface ErrorReportRequest {
  errors: RowError[];
  originalRows: Record<string, unknown>[];
}

export async function downloadErrorReport(
  moduleKey: string,
  errors: RowError[],
  originalRows: Record<string, unknown>[],
): Promise<string> {
  const session = await auth();

  if (session?.error === "RefreshTokenError") {
    throw new AuthenticationError();
  }

  const token = session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${IMPORT_API_URL}/api/import/${moduleKey}/error-report`, {
    method: "POST",
    headers,
    body: JSON.stringify({ errors, originalRows }),
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

  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return base64;
}
