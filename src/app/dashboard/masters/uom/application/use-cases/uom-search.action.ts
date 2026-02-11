"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { Uom } from "../../domain/entities/uom.entity";

const search = createSearchAction<Uom & Record<string, unknown>>(
  "/onerp/uom",
  {
    code: "uom_id",
    value: "name",
    searchFields: ["code", "name"],
    metaFields: ["code", "category", "conversion_factor"],
  }
);

export async function searchUom(query: string) {
  return search(query);
}
