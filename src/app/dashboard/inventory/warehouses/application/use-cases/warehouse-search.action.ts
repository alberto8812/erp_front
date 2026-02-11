"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { Warehouse } from "../../domain/entities/warehouse.entity";

const search = createSearchAction<Warehouse & Record<string, unknown>>(
  "/onerp/inventory/warehouses",
  {
    code: "warehouse_id",
    value: "name",
    searchFields: ["code", "name"],
    metaFields: ["code", "city", "is_default"],
  }
);

export async function searchWarehouses(query: string) {
  return search(query);
}
