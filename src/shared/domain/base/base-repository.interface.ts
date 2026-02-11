import { PaginatedResponse } from "./base-entity.types";

export interface CursorPaginationParams {
  limit: number;
  afterCursor?: string | null;
  beforeCursor?: string | null;
}

export interface BasePaginatedRepository<T> {
  findAllPaginated(params: CursorPaginationParams): Promise<PaginatedResponse<T>>;
  findById(id: string): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

export interface BaseListRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}
