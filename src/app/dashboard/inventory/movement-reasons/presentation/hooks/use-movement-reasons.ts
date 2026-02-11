"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/movement-reason.actions";
import type { MovementReason } from "../../domain/entities/movement-reason.entity";

export function useMovementReasons() {
  return usePaginatedModule<MovementReason>("movement-reasons", actions);
}
