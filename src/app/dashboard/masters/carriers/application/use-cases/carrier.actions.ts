"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { Carrier } from "../../domain/entities/carrier.entity";

const actions = createPaginatedActions<Carrier>("/onerp/carriers");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
