"use server";

import { apiClient } from "@/lib/api";

interface AssetSearchResult {
  asset_id: string;
  asset_code: string;
  asset_name: string;
  criticality?: string;
}

interface ProductSearchResult {
  product_id: string;
  sku: string;
  name: string;
  uom?: string;
}

export async function searchAssetsForPlan(query: string): Promise<AssetSearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await apiClient<AssetSearchResult[]>(
      `/onerp/maintenance/assets/search?q=${encodeURIComponent(query)}`,
      { method: "GET" }
    );
    return response;
  } catch {
    return [];
  }
}

export async function searchProductsForPlan(query: string): Promise<ProductSearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await apiClient<ProductSearchResult[]>(
      `/onerp/inventory/products/search?q=${encodeURIComponent(query)}`,
      { method: "GET" }
    );
    return response;
  } catch {
    return [];
  }
}
