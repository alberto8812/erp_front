"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { WarehouseLocation } from "../../domain/entities/warehouse-location.entity";

const actions = createPaginatedActions<WarehouseLocation>("/onerp/inventory/warehouse-locations");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
