"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/third-party.actions";
import type { ThirdParty } from "../../domain/entities/third-party.entity";

export function useThirdParties() {
  return usePaginatedModule<ThirdParty>("third-parties", actions);
}
