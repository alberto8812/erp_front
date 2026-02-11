"use client";

import { useRouter } from "next/navigation";
import { Plus, Eye, Send, FileCheck, FileX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useInvoices } from "../hooks/use-invoices";
import { columnsInvoice } from "./columns-invoice";
import type { CustomerInvoice } from "../../domain/entities/invoice.entity";

export function InvoicesTablePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    deleteMutation,
  } = useInvoices();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columnsWithActions = [
    ...columnsInvoice,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: CustomerInvoice } }) => {
        const invoice = row.original;
        const canDelete = invoice.status === "draft";
        const canPost = invoice.status === "draft";
        const canSendToDian = invoice.status === "posted" && !invoice.dian_cufe;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Ver detalle"
              onClick={() => router.push(`/dashboard/sales/invoices/${invoice.invoice_id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
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
            {canSendToDian && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-success"
                title="Enviar a DIAN"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => handleDelete(invoice.invoice_id)}
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
        <Button size="sm" onClick={() => router.push("/dashboard/sales/invoices/new")}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nueva Factura
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsInvoice.length} />}
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
