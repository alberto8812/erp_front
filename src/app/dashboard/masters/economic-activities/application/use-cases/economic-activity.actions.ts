"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { EconomicActivity } from "../../domain/entities/economic-activity.entity";

const actions = createPaginatedActions<EconomicActivity>("/onerp/economic-activities");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
