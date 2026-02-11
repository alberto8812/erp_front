"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Send,
  ArrowRightLeft,
  MoreHorizontal,
  Pencil,
  Loader2,
  Calendar,
  Building2,
  Package,
  FileText,
  CreditCard,
  Clock,
  ChevronRight,
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
  findById,
  sendQuotation,
  acceptQuotation,
  rejectQuotation,
  convertToOrder,
} from "../application/use-cases/quotation.actions";
import type { Quotation, QuotationLine } from "../domain/entities/quotation.entity";
import {
  getQuotationStatusLabel,
  getQuotationStatusColor,
  type QuotationStatus,
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

function StatusStepper({ quotation }: { quotation: Quotation }) {
  const steps: { key: QuotationStatus; label: string }[] = [
    { key: "draft", label: "Borrador" },
    { key: "sent", label: "Enviada" },
    { key: "accepted", label: "Aceptada" },
    { key: "converted", label: "Convertida" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === quotation.status);
  const isRejected = quotation.status === "rejected";
  const isExpired = quotation.status === "expired";

  if (isRejected) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <XCircle className="h-4 w-4" />
        <span className="font-medium">Cotización Rechazada</span>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-sm text-warning">
        <Clock className="h-4 w-4" />
        <span className="font-medium">Cotización Expirada</span>
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

function QuotationLineRow({ line, currency }: { line: QuotationLine; currency: string }) {
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

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const quotationId = params.id as string;

  const { data: quotation, isLoading, error } = useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: () => findById(quotationId),
  });

  const sendMutation = useMutation({
    mutationFn: () => sendQuotation(quotationId),
    onSuccess: () => {
      toast({ title: "Cotización enviada al cliente" });
      queryClient.invalidateQueries({ queryKey: ["quotation", quotationId] });
    },
    onError: () => {
      toast({ title: "Error al enviar la cotización", variant: "destructive" });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptQuotation(quotationId),
    onSuccess: () => {
      toast({ title: "Cotización aceptada" });
      queryClient.invalidateQueries({ queryKey: ["quotation", quotationId] });
    },
    onError: () => {
      toast({ title: "Error al aceptar la cotización", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectQuotation(quotationId),
    onSuccess: () => {
      toast({ title: "Cotización rechazada" });
      queryClient.invalidateQueries({ queryKey: ["quotation", quotationId] });
    },
    onError: () => {
      toast({ title: "Error al rechazar la cotización", variant: "destructive" });
    },
  });

  const convertMutation = useMutation({
    mutationFn: () => convertToOrder(quotationId),
    onSuccess: (data) => {
      toast({ title: "Cotización convertida a orden de venta" });
      queryClient.invalidateQueries({ queryKey: ["quotation", quotationId] });
      router.push(`/dashboard/sales/sales-orders/${data.sales_order_id}`);
    },
    onError: () => {
      toast({ title: "Error al convertir la cotización", variant: "destructive" });
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

  if (error || !quotation) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar la cotización</p>
          <button
            onClick={() => router.push("/dashboard/sales/quotations")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const canEdit = quotation.status === "draft";
  const canSend = quotation.status === "draft";
  const canAcceptReject = quotation.status === "sent";
  const canConvert = quotation.status === "accepted";

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
                onClick={() => router.push("/dashboard/sales/quotations")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {quotation.quotation_number}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuotationStatusColor(
                      quotation.status
                    )}`}
                  >
                    {getQuotationStatusLabel(quotation.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {quotation.customer?.legal_name || quotation.customer?.comercial_name || "Sin cliente"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {canSend && (
                <Button
                  size="sm"
                  onClick={() => sendMutation.mutate()}
                  disabled={sendMutation.isPending}
                >
                  {sendMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Enviar
                </Button>
              )}

              {canAcceptReject && (
                <Button
                  size="sm"
                  onClick={() => acceptMutation.mutate()}
                  disabled={acceptMutation.isPending}
                >
                  {acceptMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Aceptar
                </Button>
              )}

              {canConvert && (
                <Button
                  size="sm"
                  onClick={() => convertMutation.mutate()}
                  disabled={convertMutation.isPending}
                >
                  {convertMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Convertir a Orden
                </Button>
              )}

              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/sales/quotations/${quotationId}/edit`)}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Editar
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {canAcceptReject && (
                    <DropdownMenuItem
                      onClick={() => rejectMutation.mutate()}
                      className="text-destructive focus:text-destructive"
                      disabled={rejectMutation.isPending}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rechazar
                    </DropdownMenuItem>
                  )}
                  {quotation.sales_order_id && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/sales/sales-orders/${quotation.sales_order_id}`)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Orden de Venta
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <StatusStepper quotation={quotation} />
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
                  <p className="text-sm font-medium">{formatDate(quotation.quotation_date)}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Válida Hasta</span>
                  </div>
                  <p className="text-sm font-medium">
                    {quotation.valid_until ? formatDate(quotation.valid_until) : "—"}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Pago</span>
                  </div>
                  <p className="text-sm font-medium truncate">
                    {quotation.payment_term?.name || "—"}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Lineas</span>
                  </div>
                  <p className="text-sm font-medium">{quotation.lines?.length || 0}</p>
                </div>
              </div>

              {/* Lines Table */}
              <Card className="overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Lineas de la Cotización</h3>
                      <p className="text-xs text-muted-foreground">
                        {quotation.lines?.length || 0} productos
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
                      {quotation.lines && quotation.lines.length > 0 ? (
                        quotation.lines.map((line) => (
                          <QuotationLineRow
                            key={line.line_id}
                            line={line}
                            currency={quotation.currency}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No hay lineas en esta cotización
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Notes */}
              {(quotation.notes || quotation.internal_notes || quotation.terms_conditions) && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Notas</h3>
                    </div>
                    <div className="space-y-3">
                      {quotation.notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notas para el cliente</p>
                          <p className="text-sm">{quotation.notes}</p>
                        </div>
                      )}
                      {quotation.internal_notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notas internas</p>
                          <p className="text-sm">{quotation.internal_notes}</p>
                        </div>
                      )}
                      {quotation.terms_conditions && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Términos y condiciones</p>
                          <p className="text-sm">{quotation.terms_conditions}</p>
                        </div>
                      )}
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
                        {formatCurrency(quotation.subtotal, quotation.currency)}
                      </span>
                    </div>

                    {quotation.discount_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Descuento</span>
                        <span className="font-mono tabular-nums text-destructive">
                          -{formatCurrency(quotation.discount_amount, quotation.currency)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impuestos</span>
                      <span className="font-mono tabular-nums">
                        {formatCurrency(quotation.tax_amount, quotation.currency)}
                      </span>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-2xl font-semibold font-mono tabular-nums tracking-tight">
                          {formatCurrency(quotation.total_amount, quotation.currency)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {quotation.currency}
                      </p>
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
                    {quotation.converted_at && (
                      <TimelineEvent
                        title="Convertida a orden"
                        date={quotation.converted_at}
                        color="success"
                      />
                    )}
                    {quotation.accepted_at && (
                      <TimelineEvent
                        title="Cotización aceptada"
                        date={quotation.accepted_at}
                        color="success"
                      />
                    )}
                    {quotation.rejected_at && (
                      <TimelineEvent
                        title="Cotización rechazada"
                        date={quotation.rejected_at}
                        color="destructive"
                      />
                    )}
                    {quotation.sent_at && (
                      <TimelineEvent
                        title="Cotización enviada"
                        date={quotation.sent_at}
                        color="primary"
                      />
                    )}
                    {quotation.created_at && (
                      <TimelineEvent
                        title="Cotización creada"
                        date={quotation.created_at}
                        color="primary"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              {quotation.customer && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Cliente
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">{quotation.customer.legal_name}</p>
                      {quotation.customer.comercial_name && (
                        <p className="text-xs text-muted-foreground">
                          {quotation.customer.comercial_name}
                        </p>
                      )}
                      {quotation.customer.tax_id && (
                        <p className="text-xs font-mono text-muted-foreground">
                          NIT: {quotation.customer.tax_id}
                        </p>
                      )}
                    </div>
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
