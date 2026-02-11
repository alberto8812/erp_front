"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Loader2,
  Calendar,
  Building2,
  FileText,
  Clock,
  ChevronRight,
  FileCheck,
  Ban,
  CreditCard,
  Receipt,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  findById,
  approveCreditNote,
  rejectCreditNote,
  postCreditNote,
  voidCreditNote,
} from "../application/use-cases/credit-note.actions";
import type { CustomerCreditNote, CreditNoteLine } from "../domain/entities/credit-note.entity";
import {
  getCreditNoteStatusLabel,
  getCreditNoteStatusColor,
  getCreditNoteTypeLabel,
  type CreditNoteStatus,
} from "../../shared/types/sales.types";

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return formatDate(dateString);
}

function StatusStepper({ creditNote }: { creditNote: CustomerCreditNote }) {
  const steps: { key: CreditNoteStatus; label: string }[] = creditNote.approval_required
    ? [
        { key: "draft", label: "Borrador" },
        { key: "pending_approval", label: "Pendiente" },
        { key: "approved", label: "Aprobada" },
        { key: "posted", label: "Contabilizada" },
        { key: "applied", label: "Aplicada" },
      ]
    : [
        { key: "draft", label: "Borrador" },
        { key: "posted", label: "Contabilizada" },
        { key: "applied", label: "Aplicada" },
      ];

  const currentIndex = steps.findIndex((s) => s.key === creditNote.status);
  const isVoided = creditNote.status === "voided";
  const isCancelled = creditNote.status === "cancelled";

  if (isVoided) {
    return (
      <div className="flex items-center gap-2 text-sm text-warning">
        <Ban className="h-4 w-4" />
        <span className="font-medium">Nota de Crédito Anulada</span>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <XCircle className="h-4 w-4" />
        <span className="font-medium">Nota de Crédito Cancelada</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                isCompleted
                  ? "bg-success/10 text-success"
                  : isCurrent
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground/50"
              }`}
            >
              {isCompleted && <CheckCircle className="h-3 w-3" />}
              {isCurrent && <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
              <span className={isPending ? "opacity-50" : ""}>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight
                className={`h-3 w-3 mx-0.5 ${
                  index < currentIndex ? "text-success" : "text-muted-foreground/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CreditNoteLineRow({ line, currency }: { line: CreditNoteLine; currency: string }) {
  return (
    <TableRow className="group">
      <TableCell className="text-center text-muted-foreground font-mono text-xs">
        {line.line_number}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-sm line-clamp-1">
            {line.description || "Sin descripcion"}
          </span>
          {line.product?.sku && (
            <span className="text-xs text-muted-foreground font-mono">
              {line.product.sku}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm">
        {line.quantity}
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm">
        {formatCurrency(line.unit_price, currency)}
      </TableCell>
      <TableCell className="text-right">
        {line.discount_percent > 0 ? (
          <span className="text-xs text-destructive font-mono">-{line.discount_percent}%</span>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm font-medium">
        {formatCurrency(line.line_total, currency)}
      </TableCell>
    </TableRow>
  );
}

function TimelineEvent({
  title,
  date,
  color = "default",
}: {
  title: string;
  date: string;
  color?: "default" | "primary" | "success" | "destructive" | "warning";
}) {
  const colorClasses = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    success: "bg-success",
    destructive: "bg-destructive",
    warning: "bg-warning",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`h-2 w-2 rounded-full mt-1.5 ${colorClasses[color]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{formatRelativeDate(date)}</p>
      </div>
    </div>
  );
}

export default function CreditNoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const creditNoteId = params.id as string;

  const { data: creditNote, isLoading, error } = useQuery({
    queryKey: ["credit-note", creditNoteId],
    queryFn: () => findById(creditNoteId),
  });

  const approveMutation = useMutation({
    mutationFn: () => approveCreditNote(creditNoteId),
    onSuccess: () => {
      toast({ title: "Nota de crédito aprobada" });
      queryClient.invalidateQueries({ queryKey: ["credit-note", creditNoteId] });
    },
    onError: () => {
      toast({ title: "Error al aprobar", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason?: string) => rejectCreditNote(creditNoteId, reason),
    onSuccess: () => {
      toast({ title: "Nota de crédito rechazada" });
      queryClient.invalidateQueries({ queryKey: ["credit-note", creditNoteId] });
    },
    onError: () => {
      toast({ title: "Error al rechazar", variant: "destructive" });
    },
  });

  const postMutation = useMutation({
    mutationFn: () => postCreditNote(creditNoteId),
    onSuccess: () => {
      toast({ title: "Nota de crédito contabilizada" });
      queryClient.invalidateQueries({ queryKey: ["credit-note", creditNoteId] });
    },
    onError: () => {
      toast({ title: "Error al contabilizar", variant: "destructive" });
    },
  });

  const voidMutation = useMutation({
    mutationFn: (reason?: string) => voidCreditNote(creditNoteId, reason),
    onSuccess: () => {
      toast({ title: "Nota de crédito anulada" });
      queryClient.invalidateQueries({ queryKey: ["credit-note", creditNoteId] });
    },
    onError: () => {
      toast({ title: "Error al anular", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-14 w-full" />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="col-span-4 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !creditNote) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar la nota de crédito</p>
          <button
            onClick={() => router.push("/dashboard/sales/credit-notes")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const canApprove = creditNote.status === "pending_approval";
  const canPost = creditNote.status === "approved" || (creditNote.status === "draft" && !creditNote.approval_required);
  const canVoid = creditNote.status === "posted" && creditNote.balance_remaining === creditNote.total_amount;
  const canApplyToInvoice = (creditNote.status === "posted" || creditNote.status === "partial") && creditNote.balance_remaining > 0;

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => router.push("/dashboard/sales/credit-notes")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {creditNote.credit_note_number}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCreditNoteStatusColor(
                      creditNote.status
                    )}`}
                  >
                    {getCreditNoteStatusLabel(creditNote.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {creditNote.customer?.legal_name || creditNote.customer?.comercial_name || "Sin cliente"} • {getCreditNoteTypeLabel(creditNote.credit_note_type)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {canApprove && (
                <>
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate()}
                    disabled={approveMutation.isPending}
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectMutation.mutate(undefined)}
                    disabled={rejectMutation.isPending}
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <XCircle className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Rechazar
                  </Button>
                </>
              )}

              {canPost && (
                <Button
                  size="sm"
                  onClick={() => postMutation.mutate()}
                  disabled={postMutation.isPending}
                >
                  {postMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileCheck className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Contabilizar
                </Button>
              )}

              {canApplyToInvoice && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast({ title: "Funcionalidad de aplicación próximamente" })}
                >
                  <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                  Aplicar a Factura
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {creditNote.original_invoice_id && (
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/sales/invoices/${creditNote.original_invoice_id}`)}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      Ver Factura Original
                    </DropdownMenuItem>
                  )}
                  {creditNote.return_id && (
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/sales/returns/${creditNote.return_id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Devolución
                    </DropdownMenuItem>
                  )}
                  {canVoid && (
                    <>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-warning focus:text-warning"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Anular
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Anular Nota de Crédito</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción anulará la nota de crédito {creditNote.credit_note_number}.
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => voidMutation.mutate(undefined)}
                              className="bg-warning text-warning-foreground hover:bg-warning/90"
                            >
                              Anular
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <StatusStepper creditNote={creditNote} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Fecha</span>
                  </div>
                  <p className="text-sm font-medium">{formatDate(creditNote.credit_note_date)}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Tipo</span>
                  </div>
                  <p className="text-sm font-medium truncate">
                    {getCreditNoteTypeLabel(creditNote.credit_note_type)}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Aplicado</span>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(creditNote.amount_applied, creditNote.currency)}
                  </p>
                </div>

                <div className={`rounded-lg p-3 ${creditNote.balance_remaining > 0 ? "bg-success/10" : "bg-muted/30"}`}>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Receipt className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Disponible</span>
                  </div>
                  <p className={`text-sm font-medium ${creditNote.balance_remaining > 0 ? "text-success" : ""}`}>
                    {formatCurrency(creditNote.balance_remaining, creditNote.currency)}
                  </p>
                </div>
              </div>

              {/* Lines Table */}
              <Card className="overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Lineas de la Nota de Crédito</h3>
                      <p className="text-xs text-muted-foreground">
                        {creditNote.lines?.length || 0} items
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead className="w-12 text-center text-[10px] font-medium uppercase tracking-wider">
                          #
                        </TableHead>
                        <TableHead className="text-[10px] font-medium uppercase tracking-wider">
                          Producto
                        </TableHead>
                        <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">
                          Cantidad
                        </TableHead>
                        <TableHead className="w-28 text-right text-[10px] font-medium uppercase tracking-wider">
                          Precio
                        </TableHead>
                        <TableHead className="w-16 text-right text-[10px] font-medium uppercase tracking-wider">
                          Dto.
                        </TableHead>
                        <TableHead className="w-32 text-right text-[10px] font-medium uppercase tracking-wider">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditNote.lines && creditNote.lines.length > 0 ? (
                        creditNote.lines.map((line) => (
                          <CreditNoteLineRow
                            key={line.line_id}
                            line={line}
                            currency={creditNote.currency}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No hay lineas en esta nota de crédito
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Notes */}
              {(creditNote.notes || creditNote.internal_notes) && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Notas</h3>
                    </div>
                    <div className="space-y-3">
                      {creditNote.notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notas</p>
                          <p className="text-sm">{creditNote.notes}</p>
                        </div>
                      )}
                      {creditNote.internal_notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notas internas</p>
                          <p className="text-sm">{creditNote.internal_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rejection Reason */}
              {creditNote.rejection_reason && (
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-destructive" />
                      <h3 className="text-sm font-medium text-destructive">Razón de Rechazo</h3>
                    </div>
                    <p className="text-sm">{creditNote.rejection_reason}</p>
                  </CardContent>
                </Card>
              )}

              {/* Void Reason */}
              {creditNote.void_reason && (
                <Card className="border-warning/50 bg-warning/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Ban className="h-4 w-4 text-warning" />
                      <h3 className="text-sm font-medium text-warning">Razón de Anulación</h3>
                    </div>
                    <p className="text-sm">{creditNote.void_reason}</p>
                  </CardContent>
                </Card>
              )}

              {/* Applications */}
              {creditNote.applications && creditNote.applications.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Aplicaciones</h3>
                    </div>
                    <div className="space-y-2">
                      {creditNote.applications.map((app) => (
                        <div
                          key={app.application_id}
                          className="flex items-center justify-between p-2 bg-muted/30 rounded"
                        >
                          <div>
                            <button
                              onClick={() => router.push(`/dashboard/sales/invoices/${app.invoice_id}`)}
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              {app.invoice?.invoice_number || app.invoice_id}
                            </button>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeDate(app.applied_at)}
                            </p>
                          </div>
                          <span className="font-mono text-sm font-medium">
                            {formatCurrency(app.amount, creditNote.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Summary Card */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                    Resumen
                  </h3>

                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-mono tabular-nums">
                        {formatCurrency(creditNote.subtotal, creditNote.currency)}
                      </span>
                    </div>

                    {creditNote.discount_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Descuento</span>
                        <span className="font-mono tabular-nums text-destructive">
                          -{formatCurrency(creditNote.discount_amount, creditNote.currency)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impuestos</span>
                      <span className="font-mono tabular-nums">
                        {formatCurrency(creditNote.tax_amount, creditNote.currency)}
                      </span>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-2xl font-semibold font-mono tabular-nums tracking-tight">
                          {formatCurrency(creditNote.total_amount, creditNote.currency)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {creditNote.currency}
                      </p>
                    </div>

                    <div className="pt-3 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Aplicado</span>
                        <span className="font-mono tabular-nums">
                          {formatCurrency(creditNote.amount_applied, creditNote.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Disponible</span>
                        <span className={`font-mono tabular-nums font-medium ${creditNote.balance_remaining > 0 ? "text-success" : ""}`}>
                          {formatCurrency(creditNote.balance_remaining, creditNote.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Historial
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {creditNote.voided_at && (
                      <TimelineEvent
                        title="Nota de crédito anulada"
                        date={creditNote.voided_at}
                        color="warning"
                      />
                    )}
                    {creditNote.posted_at && (
                      <TimelineEvent
                        title="Contabilizada"
                        date={creditNote.posted_at}
                        color="success"
                      />
                    )}
                    {creditNote.rejected_at && (
                      <TimelineEvent
                        title="Rechazada"
                        date={creditNote.rejected_at}
                        color="destructive"
                      />
                    )}
                    {creditNote.approved_at && (
                      <TimelineEvent
                        title="Aprobada"
                        date={creditNote.approved_at}
                        color="success"
                      />
                    )}
                    {creditNote.created_at && (
                      <TimelineEvent
                        title="Nota de crédito creada"
                        date={creditNote.created_at}
                        color="primary"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              {creditNote.customer && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Cliente
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">{creditNote.customer.legal_name}</p>
                      {creditNote.customer.comercial_name && (
                        <p className="text-xs text-muted-foreground">
                          {creditNote.customer.comercial_name}
                        </p>
                      )}
                      {creditNote.customer.tax_id && (
                        <p className="text-xs font-mono text-muted-foreground">
                          NIT: {creditNote.customer.tax_id}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Original Invoice */}
              {creditNote.original_invoice && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Factura Original
                      </h3>
                    </div>

                    <button
                      onClick={() => router.push(`/dashboard/sales/invoices/${creditNote.original_invoice_id}`)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {creditNote.original_invoice.invoice_number}
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
