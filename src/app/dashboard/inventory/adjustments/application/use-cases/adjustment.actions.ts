"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import { apiClient } from "@/lib/api";
import type { Adjustment, AdjustmentLine, AdjustmentWithLines } from "../../domain/entities/adjustment.entity";

const BASE_PATH = "/onerp/inventory/adjustments";
const actions = createPaginatedActions<Adjustment>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

// Get adjustment with all lines
export async function getWithLines(id: string): Promise<AdjustmentWithLines> {
  return apiClient<AdjustmentWithLines>(`${BASE_PATH}/${id}/with-lines`, {
    method: "GET",
  });
}

// Get adjustment lines
export async function getLines(id: string): Promise<AdjustmentLine[]> {
  return apiClient<AdjustmentLine[]>(`${BASE_PATH}/${id}/lines`, {
    method: "GET",
  });
}

// Add line to adjustment
export async function addLine(
  id: string,
  data: {
    product_id: string;
    warehouse_id: string;
    location_id?: string;
    lot_id?: string;
    adjusted_quantity: number;
    adjusted_unit_cost?: number;
    reason_code?: string;
    notes?: string;
  }
): Promise<AdjustmentLine> {
  return apiClient<AdjustmentLine>(`${BASE_PATH}/${id}/lines`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update line
export async function updateLine(
  lineId: string,
  data: {
    adjusted_quantity?: number;
    adjusted_unit_cost?: number;
    reason_code?: string;
    notes?: string;
  }
): Promise<AdjustmentLine> {
  return apiClient<AdjustmentLine>(`${BASE_PATH}/lines/${lineId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Remove line
export async function removeLine(lineId: string): Promise<void> {
  return apiClient<void>(`${BASE_PATH}/lines/${lineId}`, {
    method: "DELETE",
  });
}

// Workflow actions
export async function submitForApproval(id: string): Promise<Adjustment> {
  return apiClient<Adjustment>(`${BASE_PATH}/${id}/submit`, {
    method: "POST",
  });
}

export async function approve(id: string): Promise<Adjustment> {
  return apiClient<Adjustment>(`${BASE_PATH}/${id}/approve`, {
    method: "POST",
  });
}

export async function reject(id: string, reason?: string): Promise<Adjustment> {
  return apiClient<Adjustment>(`${BASE_PATH}/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function post(id: string): Promise<Adjustment> {
  return apiClient<Adjustment>(`${BASE_PATH}/${id}/post`, {
    method: "POST",
  });
}

export async function cancel(id: string, reason: string): Promise<Adjustment> {
  return apiClient<Adjustment>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
