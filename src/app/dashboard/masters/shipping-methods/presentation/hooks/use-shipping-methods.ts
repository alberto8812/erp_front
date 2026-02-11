"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/shipping-method.actions";
import type { ShippingMethod } from "../../domain/entities/shipping-method.entity";

export function useShippingMethods() {
  return usePaginatedModule<ShippingMethod>("shipping-methods", actions);
}
