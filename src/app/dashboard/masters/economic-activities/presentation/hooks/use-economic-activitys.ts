"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/economic-activity.actions";
import type { EconomicActivity } from "../../domain/entities/economic-activity.entity";

export function useEconomicActivities() {
  return usePaginatedModule<EconomicActivity>("economic-activities", actions);
}
