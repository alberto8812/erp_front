"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/failure-code.actions";
import type { FailureCode } from "../../domain/entities/failure-code.entity";

export function useFailureCodes() {
  return usePaginatedModule<FailureCode>("maintenance-failure-codes", actions);
}
