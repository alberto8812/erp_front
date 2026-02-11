"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { TaxResponsibility } from "../../domain/entities/tax-responsibility.entity";

const actions = createPaginatedActions<TaxResponsibility>("/onerp/tax-responsibilities");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
