"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { Product } from "../../domain/entities/product.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/inventory/products";
const actions = createPaginatedActions<Product>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export interface ProductStockLevel {
  stock_level_id: string;
  warehouse_id: string;
  location_id?: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  quantity_on_order: number;
  warehouse?: {
    warehouse_id: string;
    code: string;
    name: string;
  };
  location?: {
    location_id: string;
    code: string;
    name: string;
  };
}

export interface ProductKardexEntry {
  kardex_id: string;
  movement_number: string;
  movement_date: string;
  movement_type: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  running_balance?: number;
  source_document_type?: string;
  source_document_number?: string;
  warehouse?: {
    warehouse_id: string;
    code: string;
    name: string;
  };
}

export async function getProductStock(productId: string): Promise<ProductStockLevel[]> {
  return apiClient<ProductStockLevel[]>(`/onerp/inventory/stock-levels/by-product/${productId}`, {
    method: "GET",
  });
}

export async function getProductKardex(productId: string): Promise<ProductKardexEntry[]> {
  return apiClient<ProductKardexEntry[]>(`/onerp/inventory/kardex/by-product/${productId}`, {
    method: "GET",
  });
}
