"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/inventory-count.actions";
import type { InventoryCount } from "../../domain/entities/inventory-count.entity";

export function useInventoryCounts() {
  return usePaginatedModule<InventoryCount>("inventory-counts", actions);
}
