"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { BankAccount } from "../../domain/entities/bank-account.entity";

const actions = createPaginatedActions<BankAccount>("/onerp/bank-accounts");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
