"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/downtime.actions";
import type { Downtime } from "../../domain/entities/downtime.entity";

export function useDowntime() {
  return usePaginatedModule<Downtime>("maintenance-downtime", actions);
}
