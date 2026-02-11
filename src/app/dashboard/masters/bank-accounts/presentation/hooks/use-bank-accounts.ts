"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/bank-account.actions";
import type { BankAccount } from "../../domain/entities/bank-account.entity";

export function useBankAccounts() {
  return usePaginatedModule<BankAccount>("bank-accounts", actions);
}
