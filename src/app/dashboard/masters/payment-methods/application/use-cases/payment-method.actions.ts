"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { PaymentMethod } from "../../domain/entities/payment-method.entity";

const actions = createPaginatedActions<PaymentMethod>("/onerp/payment-methods");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
