"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { ThirdParty } from "../../domain/entities/third-party.entity";

const search = createSearchAction<ThirdParty & Record<string, unknown>>(
  "/onerp/third-parties",
  {
    code: "third_party_id",
    value: "legal_name",
    searchFields: ["legal_name", "comercial_name", "tax_id"],
    metaFields: ["tax_id", "comercial_name", "type", "email", "phone"],
  }
);

export async function searchThirdParties(query: string) {
  return search(query);
}

// Alias for customers specifically
export async function searchCustomers(query: string) {
  return search(query);
}
