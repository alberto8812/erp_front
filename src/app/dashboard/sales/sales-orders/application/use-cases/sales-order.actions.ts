"use server";

import { apiClient } from "@/lib/api";
import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { SalesOrder } from "../../domain/entities/sales-order.entity";

const BASE_PATH = "/onerp/sales/orders";
const actions = createPaginatedActions<SalesOrder>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

// Additional sales order specific actions
export async function approveSalesOrder(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectSalesOrder(
  id: string,
  reason: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ rejection_reason: reason }),
  });
}

export async function confirmSalesOrder(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/confirm`, {
    method: "POST",
  });
}

export async function cancelSalesOrder(
  id: string,
  reason: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ cancellation_reason: reason }),
  });
}
