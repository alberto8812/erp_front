"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  FileCheck,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainDataTable } from "@/components/tables/MainTable";
import { Show } from "@/components/show/Show.component";
import { TableSkeleton } from "@/components/tables/TableSkeleton";
import { useVendorInvoices } from "../hooks/use-vendor-invoices";
import { columnsVendorInvoices } from "./columns-vendor-invoice";
import type { VendorInvoice } from "../../domain/entities/vendor-invoice.entity";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function VendorInvoicesTablePage() {
  const router = useRouter();
  const { data, isLoading, pagination, setPagination, deleteMutation } =
    useVendorInvoices();

  const handleCreate = () => {
    router.push("/dashboard/purchasing/vendor-invoices/new");
  };

  const handleView = (invoice: VendorInvoice) => {
    router.push(`/dashboard/purchasing/vendor-invoices/${invoice.invoice_id}`);
  };

  const handleEdit = (invoice: VendorInvoice) => {
    router.push(`/dashboard/purchasing/vendor-invoices/${invoice.invoice_id}/edit`);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columnsWithActions = [
    ...columnsVendorInvoices,
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: VendorInvoice } }) => {
        const invoice = row.original;
        const canEdit = invoice.status === "draft" || invoice.status === "pending_match";
        const canDelete = invoice.status === "draft";
        const canPost = invoice.status === "matched" && !invoice.payment_hold;
        const canHold = !invoice.payment_hold && invoice.status !== "cancelled" && invoice.status !== "paid";
        const canRelease = invoice.payment_hold;

        return (
          <TooltipProvider>
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleView(invoice)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ver detalle</TooltipContent>
              </Tooltip>

              {canEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(invoice)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Editar</TooltipContent>
                </Tooltip>
              )}

              {canPost && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-success"
                    >
                      <FileCheck className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Contabilizar</TooltipContent>
                </Tooltip>
              )}

              {canHold && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-warning"
                    >
                      <PauseCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Retener pago</TooltipContent>
                </Tooltip>
              )}

              {canRelease && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-primary"
                    >
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Liberar retención</TooltipContent>
                </Tooltip>
              )}

              {canDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleDelete(invoice.invoice_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Eliminar</TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div />
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Nueva Factura
        </Button>
      </div>

      <Show
        when={!isLoading}
        fallback={<TableSkeleton columns={columnsVendorInvoices.length} />}
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
