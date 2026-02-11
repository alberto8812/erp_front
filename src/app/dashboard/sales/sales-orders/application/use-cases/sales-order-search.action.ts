"use server";

import { apiClient } from "@/lib/api";
import type { AutocompleteOption } from "@/shared/presentation/types/autocomplete.types";

interface SalesOrderSearchResult {
  order_id: string;
  order_number: string;
  order_date: string;
  customer?: {
    legal_name: string;
    comercial_name?: string;
  };
  total_amount: number;
  status: string;
}

export async function searchSalesOrders(query: string): Promise<AutocompleteOption[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await apiClient<{ data: SalesOrderSearchResult[] }>(
      `/onerp/sales/orders/search?q=${encodeURIComponent(query)}&limit=10`,
      { method: "GET" }
    );

    return response.data.map((order) => ({
      code: order.order_id,
      value: order.order_number,
      description: order.customer?.comercial_name || order.customer?.legal_name,
      meta: {
        customer_name: order.customer?.comercial_name || order.customer?.legal_name,
        order_date: order.order_date,
        total_amount: order.total_amount,
        status: order.status,
      },
    }));
  } catch (error) {
    console.error("Error searching sales orders:", error);
    return [];
  }
}

export async function searchPendingSalesOrders(query: string): Promise<AutocompleteOption[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await apiClient<{ data: SalesOrderSearchResult[] }>(
      `/onerp/sales/orders/search?q=${encodeURIComponent(query)}&status=confirmed,partial_shipped&limit=10`,
      { method: "GET" }
    );

    return response.data.map((order) => ({
      code: order.order_id,
      value: order.order_number,
      description: order.customer?.comercial_name || order.customer?.legal_name,
      meta: {
        customer_name: order.customer?.comercial_name || order.customer?.legal_name,
        order_date: order.order_date,
        total_amount: order.total_amount,
        status: order.status,
      },
    }));
  } catch (error) {
    console.error("Error searching pending sales orders:", error);
    return [];
  }
}
