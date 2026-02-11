"use server";

import { apiUpload } from "@/lib/api-upload";

export interface RowError {
  row: number;
  column: string;
  value: unknown;
  error: string;
}

export interface ImportPreviewResult {
  totalRows: number;
  validCount: number;
  errorCount: number;
  validRows: Record<string, unknown>[];
  errors: RowError[];
  errorFileBase64?: string;
}

export async function uploadPreview(
  moduleKey: string,
  formData: FormData,
  rute: string,
): Promise<ImportPreviewResult> {
  return apiUpload<ImportPreviewResult>(
    `/${rute}/${moduleKey}/preview`,
    formData,
  );
}
