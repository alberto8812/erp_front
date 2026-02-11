"use client";

import { useRouter } from "next/navigation";
import { Plus, Eye, FileCheck, Ban, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useCreditNotes } from "../hooks/use-credit-notes";
import { columnsCreditNote } from "./columns-credit-note";
import type { CustomerCreditNote } from "../../domain/entities/credit-note.entity";

export function CreditNotesTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = useCreditNotes();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columnsWithActions = [
    ...columnsCreditNote,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: CustomerCreditNote } }) => {
        const creditNote = row.original;
        const canDelete = creditNote.status === "draft";
        const canPost = creditNote.status === "approved";
        const canApprove = creditNote.status === "pending_approval";

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Ver detalle"
              onClick={() => router.push(`/dashboard/sales/credit-notes/${creditNote.credit_note_id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {canApprove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-success"
                title="Aprobar"
              >
                <FileCheck className="h-4 w-4" />
              </Button>
            )}
            {canPost && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary"
                title="Contabilizar"
              >
                <FileCheck className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(creditNote.credit_note_id)}
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div />
        <Button size="sm" onClick={() => router.push("/dashboard/sales/credit-notes/new")}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nueva Nota de Crédito
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsCreditNote.length} />}
      >
        <MainDataTable
          columns={columnsWithActions}
          data={data?.data}
          pageCount={data?.pageCount}
          rowCount={data?.rowCount}
          isLoading={isLoading}
          onPaginationChange={setPagination}
          paginationState={data?.pageInfo ?? { limit: pagination.limit }}
        />
      </Show>
    </>
  );
}
