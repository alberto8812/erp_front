"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/country.actions";
import type { Country } from "../../domain/entities/country.entity";

export function useCountries() {
  return usePaginatedModule<Country>("countries", actions);
}
