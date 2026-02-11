"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { InventoryCount, InventoryCountLine } from "../../domain/entities/inventory-count.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/inventory/inventory-counts";
const actions = createPaginatedActions<InventoryCount>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function startCount(id: string): Promise<InventoryCount> {
  return apiClient<InventoryCount>(`${BASE_PATH}/${id}/start`, {
    method: "POST",
  });
}

export async function completeCount(id: string): Promise<InventoryCount> {
  return apiClient<InventoryCount>(`${BASE_PATH}/${id}/complete`, {
    method: "POST",
  });
}

export async function approveCount(id: string): Promise<InventoryCount> {
  return apiClient<InventoryCount>(`${BASE_PATH}/${id}/approve`, {
    method: "POST",
  });
}

export async function cancelCount(id: string): Promise<InventoryCount> {
  return apiClient<InventoryCount>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
  });
}

export async function getLines(id: string): Promise<InventoryCountLine[]> {
  return apiClient<InventoryCountLine[]>(`${BASE_PATH}/${id}/lines`, {
    method: "GET",
  });
}

export async function addLine(id: string, data: {
  product_id: string;
  location_id?: string;
  lot_id?: string;
}): Promise<InventoryCountLine> {
  return apiClient<InventoryCountLine>(`${BASE_PATH}/${id}/lines`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLine(lineId: string, data: {
  counted_quantity: number;
  adjustment_reason?: string;
}): Promise<InventoryCountLine> {
  return apiClient<InventoryCountLine>(`${BASE_PATH}/lines/${lineId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
