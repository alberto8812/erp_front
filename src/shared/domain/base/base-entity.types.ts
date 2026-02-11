export interface BaseEntity {
  id: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageCount: number;
  rowCount: number;
  pageInfo: {
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}
