"use server";

import { createListActions } from "@/shared/application/use-cases/create-list-actions";
import type { StateDeparment } from "../../domain/entities/state-deparment.entity";

const actions = createListActions<StateDeparment>("/onerp/state-deparments");

export const findAll = actions.findAll;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
