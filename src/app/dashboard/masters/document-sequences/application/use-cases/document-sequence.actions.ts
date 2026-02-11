"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { DocumentSequence } from "../../domain/entities/document-sequence.entity";

const actions = createPaginatedActions<DocumentSequence>("/onerp/document-sequences");

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
