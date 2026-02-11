"use client";

import { useListModule } from "@/shared/presentation/hooks/use-list-module";
import * as actions from "../../application/use-cases/state-deparment.actions";
import type { StateDeparment } from "../../domain/entities/state-deparment.entity";

export function useStateDeparments() {
  return useListModule<StateDeparment>("state-deparments", actions);
}
