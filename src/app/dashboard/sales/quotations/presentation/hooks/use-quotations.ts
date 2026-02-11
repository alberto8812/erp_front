"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/quotation.actions";
import type { Quotation } from "../../domain/entities/quotation.entity";

export function useQuotations() {
  return usePaginatedModule<Quotation>("quotations", actions);
}
