"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/maintenance-plan.actions";
import type { MaintenancePlan } from "../../domain/entities/maintenance-plan.entity";

export function usePlans() {
  return usePaginatedModule<MaintenancePlan>("maintenance-plans", actions);
}
