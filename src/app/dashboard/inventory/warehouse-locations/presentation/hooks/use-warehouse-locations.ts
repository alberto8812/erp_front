"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/warehouse-location.actions";
import type { WarehouseLocation } from "../../domain/entities/warehouse-location.entity";

export function useWarehouseLocations() {
  return usePaginatedModule<WarehouseLocation>("warehouse-locations", actions);
}
