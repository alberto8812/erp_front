"use server";

import { createSearchAction } from "@/shared/application/use-cases/create-search-action";
import type { ProductCategory } from "../../domain/entities/product-category.entity";

const search = createSearchAction<ProductCategory & Record<string, unknown>>(
  "/onerp/inventory/product-categories",
  {
    code: "category_id",
    value: "name",
    searchFields: ["code", "name"],
    metaFields: ["code", "level", "path"],
  }
);

export async function searchProductCategories(query: string) {
  return search(query);
}
