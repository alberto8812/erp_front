"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/document-type.actions";
import type { DocumentType } from "../../domain/entities/document-type.entity";

export function useDocumentTypes() {
  return usePaginatedModule<DocumentType>("document-types", actions);
}
