"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { Country } from "../../domain/entities/country.entity";

const search = createSearchAction<Country & Record<string, unknown>>("/onerp/countries", {
  code: "id",
  value: "name",
  searchFields: ["name", "iso_code"],
});

export async function searchCountries(query: string) {
  return search(query);
}
