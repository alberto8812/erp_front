"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderFormPage } from "@/shared/presentation/components/order-form";
import { returnFormConfig } from "../../presentation/forms/return-form.config";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchUom } from "@/app/dashboard/masters/uom/application/use-cases/uom-search.action";
import * as actions from "../../application/use-cases/return.actions";
import type { SalesReturn, ReturnLine } from "../../domain/entities/return.entity";
import type { OrderLine } from "@/shared/presentation/components/order-lines";

function mapFromBackendLines(lines: ReturnLine[]): OrderLine[] {
  return lines.map((line) => ({
    id: line.line_id,
    line_number: line.line_number,
    product_id: line.product_id,
    product_name: line.product?.name || line.description,
    product_sku: line.product?.sku,
    description: line.description,
    quantity: line.quantity_returned,
    uom_id: line.uom_id,
    uom_name: line.uom?.name,
    unit_price: line.unit_price,
    discount_percent: 0,
    discount_amount: line.discount_amount,
    tax_code_id: undefined,
    tax_code_name: undefined,
    tax_percent: 0,
    tax_amount: line.tax_amount,
    line_total: line.line_total,
    notes: line.notes,
  }));
}

function mapToBackendLines(lines: OrderLine[]) {
  return lines.map((line) => ({
    product_id: line.product_id || undefined,
    description: line.description,
    quantity_returned: line.quantity,
    uom_id: line.uom_id || "UND",
    unit_price: line.unit_price,
    reason_code: "other",
    condition: "used",
  }));
}

export default function EditReturnPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const returnId = params.id as string;

  const { data: returnDoc, isLoading, error } = useQuery({
    queryKey: ["return", returnId],
    queryFn: () => actions.findById(returnId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<SalesReturn>) => actions.update(returnId, data),
    onSuccess: () => {
      toast({ title: "Devolución actualizada exitosamente" });
      queryClient.invalidateQueries({ queryKey: ["return", returnId] });
      router.push(`/dashboard/sales/returns/${returnId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la devolución",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (formData: Record<string, unknown>, lines: OrderLine[]) => {
    const dataWithLines = {
      ...formData,
      lines: mapToBackendLines(lines),
    } as Partial<SalesReturn>;

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

  if (error || !returnDoc) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar la devolución</p>
          <button
            onClick={() => router.push("/dashboard/sales/returns")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const defaultValues: Record<string, unknown> = {
    return_date: returnDoc.return_date?.split("T")[0],
    status: returnDoc.status,
    reason_code: returnDoc.reason_code,
    refund_method: returnDoc.refund_method,
    customer_id: returnDoc.customer_id,
    warehouse_id: returnDoc.warehouse_id,
    currency: returnDoc.currency,
    exchange_rate: returnDoc.exchange_rate,
    notes: returnDoc.notes,
    internal_notes: returnDoc.internal_notes,
    "customer.legal_name": returnDoc.customer?.legal_name,
    "warehouse.name": returnDoc.warehouse?.name,
  };

  const defaultLines = returnDoc.lines ? mapFromBackendLines(returnDoc.lines) : [];

  return (
    <OrderFormPage
      title="Editar Devolución"
      subtitle="Modifica los datos de la devolución"
      orderNumber={returnDoc.return_number}
      backUrl={`/dashboard/sales/returns/${returnId}`}
      formConfig={returnFormConfig}
      defaultValues={defaultValues}
      defaultLines={defaultLines}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      searchProducts={searchProducts}
      searchUom={searchUom}
      currency={returnDoc.currency || "COP"}
    />
  );
}
