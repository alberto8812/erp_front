"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import type { CustomerCreditNote } from "../../domain/entities/credit-note.entity";
import * as actions from "../../application/use-cases/credit-note.actions";

export function useCreditNotes() {
  return usePaginatedModule<CustomerCreditNote>("credit-notes", actions);
}
