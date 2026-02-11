"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/branch.actions";
import type { Branch } from "../../domain/entities/branch.entity";

export function useBranches() {
  return usePaginatedModule<Branch>("branches", actions);
}
