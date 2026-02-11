"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/price-list.actions";
import type { PriceList } from "../../domain/entities/price-list.entity";

export function usePriceLists() {
  return usePaginatedModule<PriceList>("price-lists", actions);
}
