"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { Bank } from "../../domain/entities/bank.entity";

const search = createSearchAction<Bank & Record<string, unknown>>("/onerp/banks", {
  code: "id",
  value: "bank_name",
  searchFields: ["bank_name", "bank_code"],
});

export async function searchBanks(query: string) {
  return search(query);
}
