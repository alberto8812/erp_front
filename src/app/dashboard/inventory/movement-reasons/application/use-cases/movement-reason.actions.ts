"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { MovementReason } from "../../domain/entities/movement-reason.entity";

const actions = createPaginatedActions<MovementReason>("/onerp/inventory/movement-reasons");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
