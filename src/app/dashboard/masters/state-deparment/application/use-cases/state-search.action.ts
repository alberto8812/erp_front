"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { StateDeparment } from "../../domain/entities/state-deparment.entity";

const search = createSearchAction<StateDeparment & Record<string, unknown>>("/onerp/state-deparments", {
  code: "id",
  value: "name",
  searchFields: ["name", "code"],
});

export async function searchStates(query: string) {
  return search(query);
}
