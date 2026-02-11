"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { AutocompleteFieldMapping } from "@/shared/presentation/types/autocomplete.types";

const branchMapping: AutocompleteFieldMapping = {
  code: "branch_id",
  value: "name",
  searchFields: ["code", "name"],
  metaFields: ["code", "type"],
};

export const searchBranches = createSearchAction("/onerp/branches", branchMapping);
