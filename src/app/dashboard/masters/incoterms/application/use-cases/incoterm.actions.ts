"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { Incoterm } from "../../domain/entities/incoterm.entity";

const actions = createPaginatedActions<Incoterm>("/onerp/incoterms");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
