"use server";

import { apiClient } from "@/lib/api";
import type { AutocompleteOption } from "@/shared/presentation/types/autocomplete.types";

const BASE_PATH = "/onerp/maintenance/assets";

interface AssetSearchResult {
  asset_id: string;
  asset_code: string;
  asset_name: string;
  manufacturer?: string;
  model?: string;
  status: string;
}

export async function searchAssets(query: string): Promise<AutocompleteOption[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await apiClient<AssetSearchResult[]>(`${BASE_PATH}/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
    });

    return response.map((asset) => ({
      code: asset.asset_id,
      value: `${asset.asset_code} - ${asset.asset_name}`,
      meta: {
        description: [asset.manufacturer, asset.model].filter(Boolean).join(" "),
        manufacturer: asset.manufacturer,
        model: asset.model,
        status: asset.status,
      },
    }));
  } catch {
    return [];
  }
}
