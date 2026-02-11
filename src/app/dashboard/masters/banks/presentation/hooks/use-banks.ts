"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/bank.actions";
import type { Bank } from "../../domain/entities/bank.entity";

export function useBanks() {
  return usePaginatedModule<Bank>("banks", actions);
}
