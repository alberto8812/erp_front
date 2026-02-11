"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/product-category.actions";
import type { ProductCategory } from "../../domain/entities/product-category.entity";

export function useProductCategories() {
  return usePaginatedModule<ProductCategory>("product-categories", actions);
}
