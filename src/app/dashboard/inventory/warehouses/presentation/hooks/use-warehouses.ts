"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/warehouse.actions";
import type { Warehouse } from "../../domain/entities/warehouse.entity";

export function useWarehouses() {
  return usePaginatedModule<Warehouse>("warehouses", actions);
}
