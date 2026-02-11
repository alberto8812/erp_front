"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { StockLevel } from "../../domain/entities/stock-level.entity";

const actions = createPaginatedActions<StockLevel>("/onerp/inventory/stock-levels");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
// Stock levels are managed by the system, not directly created/updated/deleted by users
