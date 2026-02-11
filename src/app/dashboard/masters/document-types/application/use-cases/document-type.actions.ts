"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { DocumentType } from "../../domain/entities/document-type.entity";

const actions = createPaginatedActions<DocumentType>("/onerp/document-types");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
