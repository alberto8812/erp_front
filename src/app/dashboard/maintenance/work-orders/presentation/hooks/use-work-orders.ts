"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/work-order.actions";
import type { MaintenanceWorkOrder } from "../../domain/entities/work-order.entity";

export function useWorkOrders() {
  return usePaginatedModule<MaintenanceWorkOrder>("maintenance-work-orders", actions);
}
