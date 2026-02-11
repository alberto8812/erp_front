"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import type { CustomerInvoice } from "../../domain/entities/invoice.entity";
import * as actions from "../../application/use-cases/invoice.actions";

export function useInvoices() {
  return usePaginatedModule<CustomerInvoice>("invoices", actions);
}
