"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/sales-order.actions";
import type { SalesOrder } from "../../domain/entities/sales-order.entity";

export function useSalesOrders() {
  return usePaginatedModule<SalesOrder>("sales-orders", actions);
}
