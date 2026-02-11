"use client";

import { useListModule } from "@/shared/presentation/hooks/use-list-module";
import * as actions from "../../application/use-cases/city.actions";
import type { City } from "../../domain/entities/city.entity";

export function useCities() {
  return useListModule<City>("cities", actions);
}
