"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/payment-term.actions";
import type { PaymentTerm } from "../../domain/entities/payment-term.entity";

export function usePaymentTerms() {
  return usePaginatedModule<PaymentTerm>("payment-terms", actions);
}
