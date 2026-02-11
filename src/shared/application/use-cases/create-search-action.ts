import { apiClient } from "@/lib/api";
import type {
  AutocompleteOption,
  AutocompleteFieldMapping,
} from "@/shared/presentation/types/autocomplete.types";

interface PaginatedSearchResponse<T> {
  data: T[];
  pageCount: number;
  rowCount: number;
}

function mapEntityToOption<T extends Record<string, unknown>>(
  entity: T,
  mapping: AutocompleteFieldMapping
): AutocompleteOption {
  const code = String(entity[mapping.code] ?? "");
  const value = String(entity[mapping.value] ?? "");

  const meta: Record<string, unknown> = {};
  if (mapping.metaFields) {
    for (const field of mapping.metaFields) {
      meta[field] = entity[field];
    }
  } else {
    for (const [key, val] of Object.entries(entity)) {
      if (key !== mapping.code && key !== mapping.value) {
        meta[key] = val;
      }
    }
  }

  return { code, value, meta };
}

export function createSearchAction<T extends Record<string, unknown>>(
  basePath: string,
  mapping: AutocompleteFieldMapping
) {
  return async function search(query: string): Promise<AutocompleteOption[]> {
    const response = await apiClient<PaginatedSearchResponse<T>>(
      `${basePath}/pagination`,
      {
        method: "POST",
        body: JSON.stringify({ limit: 20, search: query }),
      }
    );

    return response.data.map((item) => mapEntityToOption(item, mapping));
  };
}
