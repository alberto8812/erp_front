import { apiClient } from "@/lib/api";

interface PaginatedResponse<T> {
  data: T[];
  pageInfo: {
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export function createListActions<T>(basePath: string) {
  async function findAll(): Promise<T[]> {
    const response = await apiClient<PaginatedResponse<T>>(basePath, { method: "GET" });
    return response.data;
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

  return { findAll, findById, create, update, remove };
}
