"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { TaxResponsibility } from "../../domain/entities/tax-responsibility.entity";

const search = createSearchAction<TaxResponsibility & Record<string, unknown>>(
  "/onerp/tax-responsibilities",
  {
    code: "id",
    value: "name",
    searchFields: ["code", "name"],
    metaFields: ["code", "responsibility_type"],
  }
);

export async function searchTaxResponsibilities(query: string) {
  return search(query);
}
