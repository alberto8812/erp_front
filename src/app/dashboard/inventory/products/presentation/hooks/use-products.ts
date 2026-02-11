"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/product.actions";
import type { Product } from "../../domain/entities/product.entity";

export function useProducts() {
  return usePaginatedModule<Product>("products", actions);
}
