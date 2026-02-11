"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { VendorEvaluation } from "../../domain/entities/vendor-evaluation.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/purchasing/vendor-evaluations";
const actions = createPaginatedActions<VendorEvaluation>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function submitEvaluation(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/submit`, {
    method: "POST",
  });
}

export async function approveEvaluation(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectEvaluation(id: string, reason: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function calculateScores(id: string): Promise<{
  message: string;
  overall_score: number;
  classification: string
}> {
  return apiClient<{ message: string; overall_score: number; classification: string }>(
    `${BASE_PATH}/${id}/calculate-scores`,
    { method: "POST" }
  );
}

export async function getVendorHistory(
  vendorId: string
): Promise<{ evaluations: VendorEvaluation[]; average_score: number }> {
  return apiClient<{ evaluations: VendorEvaluation[]; average_score: number }>(
    `${BASE_PATH}/vendor/${vendorId}/history`,
    { method: "GET" }
  );
}
