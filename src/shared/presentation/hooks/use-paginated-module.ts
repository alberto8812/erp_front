"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import type { PaginatedResponse } from "@/shared/domain/base/base-entity.types";
import type { CursorPaginationParams } from "@/shared/domain/base/base-repository.interface";

interface CursorPaginationState {
  limit: number;
  startCursor?: string | null;
  endCursor?: string | null;
}

interface PaginatedActions<T> {
  findAllPaginated: (params: CursorPaginationParams) => Promise<PaginatedResponse<T>>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export function usePaginatedModule<T>(queryKey: string, actions: PaginatedActions<T>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pagination, setPagination] = useState<CursorPaginationState>({
    limit: 10,
    startCursor: null,
    endCursor: null,
  });

  const handleError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Error desconocido";
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, pagination],
    queryFn: () =>
      actions.findAllPaginated({
        limit: pagination.limit,
        afterCursor: pagination.startCursor,
        beforeCursor: pagination.endCursor,
      }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: (newData: Partial<T>) => actions.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Creado", description: "Registro creado correctamente." });
    },
    onError: handleError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: updateData }: { id: string; data: Partial<T> }) =>
      actions.update(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Actualizado", description: "Registro actualizado correctamente." });
    },
    onError: handleError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => actions.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Eliminado", description: "Registro eliminado correctamente." });
    },
    onError: handleError,
  });

  return {
    data,
    isLoading,
    pagination,
    setPagination,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
