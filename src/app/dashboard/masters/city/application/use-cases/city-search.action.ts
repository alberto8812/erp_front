"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { City } from "../../domain/entities/city.entity";

const search = createSearchAction<City & Record<string, unknown>>("/onerp/cities", {
  code: "id",
  value: "name",
  searchFields: ["name", "code", "dane_code"],
  metaFields: ["code", "dane_code", "is_capital"],
});

export async function searchCities(query: string) {
  return search(query);
}
