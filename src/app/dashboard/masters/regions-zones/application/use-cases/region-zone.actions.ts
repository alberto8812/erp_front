"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { RegionZone } from "../../domain/entities/region-zone.entity";

const actions = createPaginatedActions<RegionZone>("/onerp/regions-zones");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
