"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import { apiClient } from "@/lib/api";
import type { Warehouse } from "../../domain/entities/warehouse.entity";

const BASE_PATH = "/onerp/inventory/warehouses";
const actions = createPaginatedActions<Warehouse>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export interface WarehouseLocation {
  location_id: string;
  warehouse_id: string;
  code: string;
  name: string;
  description?: string;
  location_type: "zone" | "aisle" | "rack" | "shelf" | "bin";
  parent_location_id?: string;
  is_pickable: boolean;
  is_receivable: boolean;
  is_active: boolean;
  stock_count?: number;
  product_count?: number;
}

export interface WarehouseStockSummary {
  product_id: string;
  product_code: string;
  product_name: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  total_value?: number;
  location_count?: number;
}

export async function getWarehouseLocations(warehouseId: string): Promise<WarehouseLocation[]> {
  return apiClient<WarehouseLocation[]>(`${BASE_PATH}/${warehouseId}/locations`, {
    method: "GET",
  });
}

export async function getWarehouseStock(warehouseId: string): Promise<WarehouseStockSummary[]> {
  return apiClient<WarehouseStockSummary[]>(`${BASE_PATH}/${warehouseId}/stock`, {
    method: "GET",
  });
}

export async function setDefaultWarehouse(warehouseId: string): Promise<Warehouse> {
  return apiClient<Warehouse>(`${BASE_PATH}/${warehouseId}/set-default`, {
    method: "POST",
  });
}
