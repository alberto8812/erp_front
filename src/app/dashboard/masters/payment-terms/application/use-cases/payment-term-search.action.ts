"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { PaymentTerm } from "../../domain/entities/payment-term.entity";

const search = createSearchAction<PaymentTerm & Record<string, unknown>>(
  "/onerp/payment-terms",
  {
    code: "payment_term_id",
    value: "name",
    searchFields: ["code", "name"],
    metaFields: ["code", "days", "is_default"],
  }
);

export async function searchPaymentTerms(query: string) {
  return search(query);
}
