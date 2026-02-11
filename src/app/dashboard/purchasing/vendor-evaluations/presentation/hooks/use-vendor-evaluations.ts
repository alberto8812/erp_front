"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/vendor-evaluation.actions";
import type { VendorEvaluation } from "../../domain/entities/vendor-evaluation.entity";

export function useVendorEvaluations() {
  return usePaginatedModule<VendorEvaluation>("vendor-evaluations", actions);
}
