"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/receipt.actions";
import type { Receipt } from "../../domain/entities/receipt.entity";

export function useReceipts() {
  return usePaginatedModule<Receipt>("receipts", actions);
}
