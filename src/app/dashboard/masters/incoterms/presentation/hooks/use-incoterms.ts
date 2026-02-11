"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/incoterm.actions";
import type { Incoterm } from "../../domain/entities/incoterm.entity";

export function useIncoterms() {
  return usePaginatedModule<Incoterm>("incoterms", actions);
}
