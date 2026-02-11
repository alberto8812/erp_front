"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { PaymentTerm } from "../../domain/entities/payment-term.entity";

const actions = createPaginatedActions<PaymentTerm>("/onerp/payment-terms");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
