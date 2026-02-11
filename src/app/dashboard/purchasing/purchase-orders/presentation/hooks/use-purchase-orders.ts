"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/purchase-order.actions";
import type { PurchaseOrder } from "../../domain/entities/purchase-order.entity";

export function usePurchaseOrders() {
  return usePaginatedModule<PurchaseOrder>("purchase-orders", actions);
}
