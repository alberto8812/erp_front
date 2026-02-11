"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/payment-method.actions";
import type { PaymentMethod } from "../../domain/entities/payment-method.entity";

export function usePaymentMethods() {
  return usePaginatedModule<PaymentMethod>("payment-methods", actions);
}
