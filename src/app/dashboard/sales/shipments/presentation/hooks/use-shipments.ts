"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/shipment.actions";
import type { Shipment } from "../../domain/entities/shipment.entity";

export function useShipments() {
  return usePaginatedModule<Shipment>("shipments", actions);
}
