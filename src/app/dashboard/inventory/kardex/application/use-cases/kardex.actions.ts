"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { Kardex } from "../../domain/entities/kardex.entity";

const actions = createPaginatedActions<Kardex>("/onerp/inventory/kardex");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
// Kardex entries are created by system operations (receipts, shipments, adjustments)
// They are not manually created through this UI
