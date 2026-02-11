"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { SalesReturn } from "../../domain/entities/return.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/sales/returns";
const actions = createPaginatedActions<SalesReturn>(BASE_PATH);

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

export async function approveReturn(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectReturn(id: string, reason?: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function markAsReceived(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/receive`, {
    method: "POST",
  });
}

export async function processReturn(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/process`, {
    method: "POST",
  });
}

export async function cancelReturn(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
  });
}
