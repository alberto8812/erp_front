"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { EconomicActivity } from "../../domain/entities/economic-activity.entity";

const search = createSearchAction<EconomicActivity & Record<string, unknown>>(
  "/onerp/economic-activities",
  {
    code: "id",
    value: "name",
    searchFields: ["code", "name", "section"],
    metaFields: ["code", "section"],
  }
);

export async function searchEconomicActivities(query: string) {
  return search(query);
}
