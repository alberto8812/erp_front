"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { ShippingMethod } from "../../domain/entities/shipping-method.entity";

const actions = createPaginatedActions<ShippingMethod>("/onerp/shipping-methods");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
