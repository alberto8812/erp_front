"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/tax-responsibility.actions";
import type { TaxResponsibility } from "../../domain/entities/tax-responsibility.entity";

export function useTaxResponsibilities() {
  return usePaginatedModule<TaxResponsibility>("tax-responsibilities", actions);
}
