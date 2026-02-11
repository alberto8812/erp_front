"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import { apiClient } from "@/lib/api";
import type { Lot } from "../../domain/entities/lot.entity";

const BASE_PATH = "/onerp/inventory/lots";
const actions = createPaginatedActions<Lot>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export interface AvailableLot {
  lot_id: string;
  lot_number: string;
  serial_number?: string;
  quantity_available: number;
  expiration_date?: string;
  manufacture_date?: string;
  location_id: string;
  location_name: string;
  warehouse_id: string;
  warehouse_name: string;
  priority_score?: number;
}

export interface GetAvailableLotsRequest {
  product_id: string;
  warehouse_id: string;
  strategy: "FIFO" | "FEFO";
  quantity_needed?: number;
}

export async function getAvailableLots(
  request: GetAvailableLotsRequest
): Promise<AvailableLot[]> {
  return apiClient<AvailableLot[]>(`${BASE_PATH}/available`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
