"use server";

import { createListActions } from "@/shared/application/use-cases/create-list-actions";
import type { City } from "../../domain/entities/city.entity";

const actions = createListActions<City>("/onerp/cities");

export const findAll = actions.findAll;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;
