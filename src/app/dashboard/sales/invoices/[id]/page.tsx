"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Send,
  MoreHorizontal,
  Loader2,
  Calendar,
  Building2,
  FileText,
  CreditCard,
  Clock,
  ChevronRight,
  FileCheck,
  Ban,
  AlertTriangle,
  Receipt,
  DollarSign,
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
  postInvoice,
  voidInvoice,
  cancelInvoice,
  sendToDian,
  checkDianStatus,
} from "../application/use-cases/invoice.actions";
import type { CustomerInvoice, InvoiceLine } from "../domain/entities/invoice.entity";
import {
  getInvoiceStatusLabel,
  getInvoiceStatusColor,
  type InvoiceStatus,
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

function StatusStepper({ invoice }: { invoice: CustomerInvoice }) {
  const steps: { key: InvoiceStatus; label: string }[] = [
    { key: "draft", label: "Borrador" },
    { key: "posted", label: "Contabilizada" },
    { key: "partial", label: "Pago Parcial" },
    { key: "paid", label: "Pagada" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === invoice.status);
  const isVoided = invoice.status === "voided";
  const isCancelled = invoice.status === "cancelled";
  const isOverdue = invoice.status === "overdue";

  if (isVoided) {
    return (
      <div className="flex items-center gap-2 text-sm text-warning">
        <Ban className="h-4 w-4" />
        <span className="font-medium">Factura Anulada</span>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <XCircle className="h-4 w-4" />
        <span className="font-medium">Factura Cancelada</span>
      </div>
    );
  }

  if (isOverdue) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-medium">Factura Vencida</span>
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

function InvoiceLineRow({ line, currency }: { line: InvoiceLine; currency: string }) {
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
      <TableCell className="text-right font-mono tabular-nums text-sm">
        {formatCurrency(line.tax_amount, currency)}
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

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const invoiceId = params.id as string;

  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => findById(invoiceId),
  });

  const postMutation = useMutation({
    mutationFn: () => postInvoice(invoiceId),
    onSuccess: () => {
      toast({ title: "Factura contabilizada exitosamente" });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
    },
    onError: () => {
      toast({ title: "Error al contabilizar la factura", variant: "destructive" });
    },
  });

  const sendToDianMutation = useMutation({
    mutationFn: () => sendToDian(invoiceId),
    onSuccess: () => {
      toast({ title: "Factura enviada a la DIAN" });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
    },
    onError: () => {
      toast({ title: "Error al enviar a la DIAN", variant: "destructive" });
    },
  });

  const voidMutation = useMutation({
    mutationFn: (reason?: string) => voidInvoice(invoiceId, reason),
    onSuccess: () => {
      toast({ title: "Factura anulada" });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
    },
    onError: () => {
      toast({ title: "Error al anular la factura", variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => cancelInvoice(invoiceId, reason),
    onSuccess: () => {
      toast({ title: "Factura cancelada" });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
    },
    onError: () => {
      toast({ title: "Error al cancelar la factura", variant: "destructive" });
    },
  });

  const checkDianMutation = useMutation({
    mutationFn: () => checkDianStatus(invoiceId),
    onSuccess: (data) => {
      toast({ title: `Estado DIAN: ${data.status}` });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
    },
    onError: () => {
      toast({ title: "Error al consultar estado DIAN", variant: "destructive" });
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

  if (error || !invoice) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar la factura</p>
          <button
            onClick={() => router.push("/dashboard/sales/invoices")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const canPost = invoice.status === "draft";
  const canSendToDian = invoice.status === "posted" && !invoice.dian_cufe;
  const canCheckDian = invoice.dian_cufe && invoice.dian_status !== "accepted";
  const canVoid = invoice.status === "posted" && !invoice.dian_cufe;
  const canCancel = invoice.status === "draft";
  const isOverdue = new Date(invoice.due_date) < new Date() &&
                    invoice.status !== "paid" &&
                    invoice.status !== "voided" &&
                    invoice.status !== "cancelled";

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
                onClick={() => router.push("/dashboard/sales/invoices")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {invoice.invoice_number}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInvoiceStatusColor(
                      invoice.status
                    )}`}
                  >
                    {getInvoiceStatusLabel(invoice.status)}
                  </span>
                  {invoice.dian_cufe && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">
                      DIAN
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {invoice.customer?.legal_name || invoice.customer?.comercial_name || "Sin cliente"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
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

              {canSendToDian && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendToDianMutation.mutate()}
                  disabled={sendToDianMutation.isPending}
                >
                  {sendToDianMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Enviar a DIAN
                </Button>
              )}

              {canCheckDian && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => checkDianMutation.mutate()}
                  disabled={checkDianMutation.isPending}
                >
                  {checkDianMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Receipt className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Consultar DIAN
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {invoice.sales_order_id && (
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/sales/sales-orders/${invoice.sales_order_id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Orden de Venta
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
                            Anular Factura
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Anular Factura</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción anulará la factura {invoice.invoice_number}.
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
                  {canCancel && (
                    <>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar Factura
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar Factura</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción cancelará la factura {invoice.invoice_number}.
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Volver</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => cancelMutation.mutate("Cancelado por usuario")}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Cancelar Factura
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
            <StatusStepper invoice={invoice} />
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
                  <p className="text-sm font-medium">{formatDate(invoice.invoice_date)}</p>
                </div>

                <div className={`rounded-lg p-3 ${isOverdue ? "bg-destructive/10" : "bg-muted/30"}`}>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Vencimiento</span>
                  </div>
                  <p className={`text-sm font-medium ${isOverdue ? "text-destructive" : ""}`}>
                    {formatDate(invoice.due_date)}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Términos</span>
                  </div>
                  <p className="text-sm font-medium truncate">
                    {invoice.payment_term?.name || "—"}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Pagado</span>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(invoice.amount_paid, invoice.currency)}
                  </p>
                </div>
              </div>

              {/* DIAN Info */}
              {invoice.dian_cufe && (
                <Card className="bg-success/5 border-success/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Receipt className="h-4 w-4 text-success" />
                      <h3 className="text-sm font-medium text-success">Facturación Electrónica DIAN</h3>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">CUFE:</span>
                        <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded break-all">
                          {invoice.dian_cufe}
                        </code>
                      </div>
                      {invoice.dian_status && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Estado:</span>
                          <span className="font-medium">{invoice.dian_status}</span>
                        </div>
                      )}
                      {invoice.dian_sent_at && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Enviada:</span>
                          <span>{formatDate(invoice.dian_sent_at)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lines Table */}
              <Card className="overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Lineas de la Factura</h3>
                      <p className="text-xs text-muted-foreground">
                        {invoice.lines?.length || 0} productos
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
                        <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">
                          IVA
                        </TableHead>
                        <TableHead className="w-32 text-right text-[10px] font-medium uppercase tracking-wider">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.lines && invoice.lines.length > 0 ? (
                        invoice.lines.map((line) => (
                          <InvoiceLineRow
                            key={line.line_id}
                            line={line}
                            currency={invoice.currency}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            No hay lineas en esta factura
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Notes */}
              {(invoice.notes || invoice.internal_notes) && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Notas</h3>
                    </div>
                    <div className="space-y-3">
                      {invoice.notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notas para el cliente</p>
                          <p className="text-sm">{invoice.notes}</p>
                        </div>
                      )}
                      {invoice.internal_notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notas internas</p>
                          <p className="text-sm">{invoice.internal_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Void Reason */}
              {invoice.void_reason && (
                <Card className="border-warning/50 bg-warning/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Ban className="h-4 w-4 text-warning" />
                      <h3 className="text-sm font-medium text-warning">Razón de Anulación</h3>
                    </div>
                    <p className="text-sm">{invoice.void_reason}</p>
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
                        {formatCurrency(invoice.subtotal, invoice.currency)}
                      </span>
                    </div>

                    {invoice.discount_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Descuento</span>
                        <span className="font-mono tabular-nums text-destructive">
                          -{formatCurrency(invoice.discount_amount, invoice.currency)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impuestos</span>
                      <span className="font-mono tabular-nums">
                        {formatCurrency(invoice.tax_amount, invoice.currency)}
                      </span>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-2xl font-semibold font-mono tabular-nums tracking-tight">
                          {formatCurrency(invoice.total_amount, invoice.currency)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {invoice.currency}
                      </p>
                    </div>

                    {invoice.balance_due > 0 && invoice.status !== "voided" && invoice.status !== "cancelled" && (
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium">Saldo Pendiente</span>
                          <span className={`text-lg font-semibold font-mono tabular-nums ${invoice.balance_due > 0 ? "text-destructive" : "text-success"}`}>
                            {formatCurrency(invoice.balance_due, invoice.currency)}
                          </span>
                        </div>
                      </div>
                    )}
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
                    {invoice.voided_at && (
                      <TimelineEvent
                        title="Factura anulada"
                        date={invoice.voided_at}
                        color="warning"
                      />
                    )}
                    {invoice.dian_sent_at && (
                      <TimelineEvent
                        title="Enviada a DIAN"
                        date={invoice.dian_sent_at}
                        color="success"
                      />
                    )}
                    {invoice.posted_at && (
                      <TimelineEvent
                        title="Factura contabilizada"
                        date={invoice.posted_at}
                        color="primary"
                      />
                    )}
                    {invoice.created_at && (
                      <TimelineEvent
                        title="Factura creada"
                        date={invoice.created_at}
                        color="primary"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              {invoice.customer && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Cliente
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">{invoice.customer.legal_name}</p>
                      {invoice.customer.comercial_name && (
                        <p className="text-xs text-muted-foreground">
                          {invoice.customer.comercial_name}
                        </p>
                      )}
                      {invoice.customer.tax_id && (
                        <p className="text-xs font-mono text-muted-foreground">
                          NIT: {invoice.customer.tax_id}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Order */}
              {invoice.sales_order && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Orden de Venta
                      </h3>
                    </div>

                    <button
                      onClick={() => router.push(`/dashboard/sales/sales-orders/${invoice.sales_order_id}`)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {invoice.sales_order.order_number}
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
