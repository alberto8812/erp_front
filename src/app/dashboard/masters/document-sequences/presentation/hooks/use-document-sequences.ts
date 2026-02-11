"use client";

import { usePaginatedModule } from "@/shared/presentation/hooks/use-paginated-module";
import * as actions from "../../application/use-cases/document-sequence.actions";
import type { DocumentSequence } from "../../domain/entities/document-sequence.entity";

export function useDocumentSequences() {
  return usePaginatedModule<DocumentSequence>("document-sequences", actions);
}
