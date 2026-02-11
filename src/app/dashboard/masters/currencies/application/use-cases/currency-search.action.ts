"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { Currency } from "../../domain/entities/currency.entity";

const search = createSearchAction<Currency & Record<string, unknown>>("/onerp/currencies", {
  code: "currency_id",
  value: "name",
  searchFields: ["name", "iso_code"],
});

export async function searchCurrencies(query: string) {
  return search(query);
}
