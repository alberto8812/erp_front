"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { Shipment } from "../../domain/entities/shipment.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/sales/shipments";
const actions = createPaginatedActions<Shipment>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function markAsReady(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/ready`, {
    method: "POST",
  });
}

export async function markAsShipped(id: string, data?: { tracking_number?: string; carrier_id?: string }): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/ship`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function markAsDelivered(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/deliver`, {
    method: "POST",
  });
}

export async function cancelShipment(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
  });
}
