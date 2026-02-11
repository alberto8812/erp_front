"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/carrier.actions";
import type { Carrier } from "../../domain/entities/carrier.entity";

export function useCarriers() {
  return usePaginatedModule<Carrier>("carriers", actions);
}
