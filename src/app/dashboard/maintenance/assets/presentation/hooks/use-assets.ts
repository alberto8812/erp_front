"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/asset.actions";
import type { MaintenanceAsset } from "../../domain/entities/asset.entity";

export function useAssets() {
  return usePaginatedModule<MaintenanceAsset>("maintenance-assets", actions);
}
