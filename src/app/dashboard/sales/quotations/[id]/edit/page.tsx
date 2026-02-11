"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderFormPage } from "@/shared/presentation/components/order-form";
import { quotationFormConfig } from "../../presentation/forms/quotation-form.config";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchUom } from "@/app/dashboard/masters/uom/application/use-cases/uom-search.action";
import { searchTaxCodes } from "@/app/dashboard/masters/tax-codes/application/use-cases/tax-code-search.action";
import * as actions from "../../application/use-cases/quotation.actions";
import type { Quotation, QuotationLine } from "../../domain/entities/quotation.entity";
import type { OrderLine } from "@/shared/presentation/components/order-lines";

function mapFromBackendLines(lines: QuotationLine[]): OrderLine[] {
  return lines.map((line) => ({
    id: line.line_id,
    line_number: line.line_number,
    product_id: line.product_id,
    product_name: line.product?.name || line.description,
    product_sku: line.product?.sku,
    description: line.description,
    quantity: line.quantity,
    uom_id: line.uom_id,
    uom_name: undefined,
    unit_price: line.unit_price,
    discount_percent: line.discount_percent,
    discount_amount: line.discount_amount,
    tax_code_id: line.tax_code_id,
    tax_code_name: undefined,
    tax_percent: line.tax_amount > 0 ? (line.tax_amount / (line.line_total - line.tax_amount)) * 100 : 0,
    tax_amount: line.tax_amount,
    line_total: line.line_total,
    notes: line.notes,
  }));
}

function mapToBackendLines(lines: OrderLine[]) {
  return lines.map((line) => ({
    product_id: line.product_id || undefined,
    description: line.description,
    quantity: line.quantity,
    uom_id: line.uom_id || "UND",
    unit_price: line.unit_price,
    discount_percent: line.discount_percent,
    tax_code_id: line.tax_code_id || undefined,
  }));
}

export default function EditQuotationPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const quotationId = params.id as string;

  const { data: quotation, isLoading, error } = useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: () => actions.findById(quotationId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Quotation>) => actions.update(quotationId, data),
    onSuccess: () => {
      toast({ title: "Cotización actualizada exitosamente" });
      queryClient.invalidateQueries({ queryKey: ["quotation", quotationId] });
      router.push(`/dashboard/sales/quotations/${quotationId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la cotización",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (formData: Record<string, unknown>, lines: OrderLine[]) => {
    const dataWithLines = {
      ...formData,
      lines: mapToBackendLines(lines),
    } as Partial<Quotation>;

    updateMutation.mutate(dataWithLines);
  };

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

  const defaultValues: Record<string, unknown> = {
    quotation_date: quotation.quotation_date?.split("T")[0],
    valid_until: quotation.valid_until?.split("T")[0],
    status: quotation.status,
    customer_id: quotation.customer_id,
    currency: quotation.currency,
    exchange_rate: quotation.exchange_rate,
    payment_term_id: quotation.payment_term_id,
    notes: quotation.notes,
    internal_notes: quotation.internal_notes,
    terms_conditions: quotation.terms_conditions,
    "customer.legal_name": quotation.customer?.legal_name,
    "payment_term.name": quotation.payment_term?.name,
  };

  const defaultLines = quotation.lines ? mapFromBackendLines(quotation.lines) : [];

  return (
    <OrderFormPage
      title="Editar Cotización"
      subtitle="Modifica los datos de la cotización"
      orderNumber={quotation.quotation_number}
      backUrl={`/dashboard/sales/quotations/${quotationId}`}
      formConfig={quotationFormConfig}
      defaultValues={defaultValues}
      defaultLines={defaultLines}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      searchProducts={searchProducts}
      searchUom={searchUom}
      searchTaxCodes={searchTaxCodes}
      currency={quotation.currency || "COP"}
    />
  );
}
