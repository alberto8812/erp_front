import { apiClient } from "@/lib/api";
import type { PaginatedResponse } from "@/shared/domain/base/base-entity.types";
import type { CursorPaginationParams } from "@/shared/domain/base/base-repository.interface";

export function createPaginatedActions<T>(basePath: string) {
  async function findAllPaginated(params: CursorPaginationParams): Promise<PaginatedResponse<T>> {
    return apiClient<PaginatedResponse<T>>(`${basePath}/pagination`, {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async function findById(id: string): Promise<T> {
    return apiClient<T>(`${basePath}/${id}`, { method: "GET" });
  }

  async function create(data: Partial<T>): Promise<T> {
    return apiClient<T>(basePath, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function update(id: string, data: Partial<T>): Promise<T> {
    return apiClient<T>(`${basePath}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async function remove(id: string): Promise<void> {
    await apiClient<void>(`${basePath}/${id}`, { method: "DELETE" });
  }

  return { findAllPaginated, findById, create, update, remove };
}
