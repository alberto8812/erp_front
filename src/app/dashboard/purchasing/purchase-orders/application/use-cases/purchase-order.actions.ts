"use server";

import { apiClient } from "@/lib/api";
import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { PurchaseOrder } from "../../domain/entities/purchase-order.entity";

const BASE_PATH = "/onerp/purchasing/purchase-orders";
const actions = createPaginatedActions<PurchaseOrder>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

// Additional purchase order specific actions
export async function approvePurchaseOrder(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectPurchaseOrder(
  id: string,
  reason: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ rejection_reason: reason }),
  });
}

export async function cancelPurchaseOrder(
  id: string,
  reason: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ cancellation_reason: reason }),
  });
}

export async function sendPurchaseOrder(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/send`, {
    method: "POST",
  });
}
