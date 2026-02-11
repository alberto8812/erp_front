"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { ProductCategory } from "../../domain/entities/product-category.entity";

const actions = createPaginatedActions<ProductCategory>("/onerp/inventory/product-categories");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
