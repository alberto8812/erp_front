"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { TaxCode } from "../../domain/entities/tax-code.entity";

const search = createSearchAction<TaxCode & Record<string, unknown>>(
  "/onerp/tax-codes",
  {
    code: "tax_code_id",
    value: "name",
    searchFields: ["code", "name", "tax_type"],
    metaFields: ["code", "tax_type", "tax_rate"],
  }
);

export async function searchTaxCodes(query: string) {
  return search(query);
}
