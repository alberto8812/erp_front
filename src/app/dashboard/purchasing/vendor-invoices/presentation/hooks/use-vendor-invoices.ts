"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/vendor-invoice.actions";
import type { VendorInvoice } from "../../domain/entities/vendor-invoice.entity";

export function useVendorInvoices() {
  return usePaginatedModule<VendorInvoice>("vendor-invoices", actions);
}
