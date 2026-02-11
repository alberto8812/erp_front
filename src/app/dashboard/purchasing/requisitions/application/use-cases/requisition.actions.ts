"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { Requisition } from "../../domain/entities/requisition.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/purchasing/purchase-requisitions";
const actions = createPaginatedActions<Requisition>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function submitForApproval(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/submit`, {
    method: "POST",
  });
}

export async function approveRequisition(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectRequisition(id: string, reason: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function convertToPurchaseOrder(
  id: string,
  lineIds?: string[]
): Promise<{ message: string; purchase_order_id: string }> {
  return apiClient<{ message: string; purchase_order_id: string }>(`${BASE_PATH}/${id}/convert-to-po`, {
    method: "POST",
    body: JSON.stringify({ line_ids: lineIds }),
  });
}

export async function cancelRequisition(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
  });
}
