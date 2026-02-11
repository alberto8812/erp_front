"use server";

import { apiClient } from "@/lib/api";
import type { AutocompleteOption } from "@/shared/presentation/types/autocomplete.types";

interface PurchaseOrderSearchResult {
  order_id: string;
  order_number: string;
  order_date: string;
  vendor?: {
    legal_name: string;
    comercial_name?: string;
  };
  total_amount: number;
  status: string;
}

export async function searchPurchaseOrders(query: string): Promise<AutocompleteOption[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await apiClient<{ data: PurchaseOrderSearchResult[] }>(
      `/onerp/purchasing/orders/search?q=${encodeURIComponent(query)}&limit=10`,
      { method: "GET" }
    );

    return response.data.map((order) => ({
      code: order.order_id,
      value: order.order_number,
      description: order.vendor?.comercial_name || order.vendor?.legal_name,
      meta: {
        vendor_name: order.vendor?.comercial_name || order.vendor?.legal_name,
        order_date: order.order_date,
        total_amount: order.total_amount,
        status: order.status,
      },
    }));
  } catch (error) {
    console.error("Error searching purchase orders:", error);
    return [];
  }
}

export async function searchPendingPurchaseOrders(query: string): Promise<AutocompleteOption[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await apiClient<{ data: PurchaseOrderSearchResult[] }>(
      `/onerp/purchasing/orders/search?q=${encodeURIComponent(query)}&status=sent,partial_received&limit=10`,
      { method: "GET" }
    );

    return response.data.map((order) => ({
      code: order.order_id,
      value: order.order_number,
      description: order.vendor?.comercial_name || order.vendor?.legal_name,
      meta: {
        vendor_name: order.vendor?.comercial_name || order.vendor?.legal_name,
        order_date: order.order_date,
        total_amount: order.total_amount,
        status: order.status,
      },
    }));
  } catch (error) {
    console.error("Error searching pending purchase orders:", error);
    return [];
  }
}
