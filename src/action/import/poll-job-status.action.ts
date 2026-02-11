"use server";

import { apiImport } from "@/lib/api-upload";

export interface JobStatusResult {
  status: "queued" | "processing" | "completed" | "failed";
  progress?: number;
  result?: {
    totalReceived: number;
    created: number;
    failed: number;
    errors: { index: number; data: Record<string, unknown>; error: string }[];
  };
  error?: string;
}

export async function pollJobStatus(jobId: string): Promise<JobStatusResult> {
  return apiImport<JobStatusResult>(`/api/import/jobs/${jobId}`);
}
