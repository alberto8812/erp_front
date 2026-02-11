"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/lot.actions";
import type { Lot } from "../../domain/entities/lot.entity";

export function useLots() {
  return usePaginatedModule<Lot>("lots", actions);
}
