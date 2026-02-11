"use server";

import { apiImport } from "@/lib/api-upload";

export interface ConfirmImportResult {
  jobId: string;
  status: string;
}

export async function confirmImport(
  moduleKey: string,
  rows: Record<string, unknown>[],
): Promise<ConfirmImportResult> {
  return apiImport<ConfirmImportResult>(`/api/import/${moduleKey}/confirm`, {
    method: "POST",
    body: { rows },
  });
}
