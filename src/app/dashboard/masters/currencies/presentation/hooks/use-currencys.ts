"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/currency.actions";
import type { Currency } from "../../domain/entities/currency.entity";

export function useCurrencies() {
  return usePaginatedModule<Currency>("currencies", actions);
}
