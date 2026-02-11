"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { Receipt } from "../../domain/entities/receipt.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/purchasing/purchase-receipts";
const actions = createPaginatedActions<Receipt>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function startInspection(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/start-inspection`, {
    method: "POST",
  });
}

export async function completeInspection(
  id: string,
  lineResults: { line_id: string; status: "passed" | "failed"; notes?: string }[]
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/complete-inspection`, {
    method: "POST",
    body: JSON.stringify({ line_results: lineResults }),
  });
}

export async function confirmReceipt(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/confirm`, {
    method: "POST",
  });
}

export async function cancelReceipt(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
  });
}

export async function createFromPurchaseOrder(
  purchaseOrderId: string,
  lineIds?: string[]
): Promise<{ message: string; receipt_id: string }> {
  return apiClient<{ message: string; receipt_id: string }>(`${BASE_PATH}/from-purchase-order/${purchaseOrderId}`, {
    method: "POST",
    body: JSON.stringify({ line_ids: lineIds }),
  });
}
