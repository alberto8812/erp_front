"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/region-zone.actions";
import type { RegionZone } from "../../domain/entities/region-zone.entity";

export function useRegionsZones() {
  return usePaginatedModule<RegionZone>("regions-zones", actions);
}
