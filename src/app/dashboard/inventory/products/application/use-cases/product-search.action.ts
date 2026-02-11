"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { Product } from "../../domain/entities/product.entity";

const search = createSearchAction<Product & Record<string, unknown>>(
  "/onerp/inventory/products",
  {
    code: "product_id",
    value: "name",
    searchFields: ["sku", "name", "barcode"],
    metaFields: ["sku", "product_type", "base_price", "average_cost"],
  }
);

export async function searchProducts(query: string) {
  return search(query);
}
