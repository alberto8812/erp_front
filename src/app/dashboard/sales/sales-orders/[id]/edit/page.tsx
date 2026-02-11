"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { OrderFormPage } from "@/shared/presentation/components/order-form";
import { salesOrderFormConfig } from "../../presentation/forms/sales-order-form.config";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";
import { searchUom } from "@/app/dashboard/masters/uom/application/use-cases/uom-search.action";
import { searchTaxCodes } from "@/app/dashboard/masters/tax-codes/application/use-cases/tax-code-search.action";
import * as actions from "../../application/use-cases/sales-order.actions";
import type { SalesOrder, SalesOrderLine } from "../../domain/entities/sales-order.entity";
import type { OrderLine } from "@/shared/presentation/components/order-lines";

function mapToOrderLines(lines?: SalesOrderLine[]): OrderLine[] {
  if (!lines) return [];
  return lines.map((line) => ({
    id: line.line_id,
    line_number: line.line_number,
    product_id: line.product_id,
    product_name: line.product?.name,
    product_sku: line.product?.sku,
    description: line.description,
    quantity: line.quantity_ordered,
    uom_id: line.uom_id,
    uom_name: undefined,
    unit_price: line.unit_price,
    discount_percent: line.discount_percent,
    discount_amount: line.discount_amount,
    tax_code_id: line.tax_code_id,
    tax_code_name: undefined,
    tax_percent:
      line.tax_amount > 0
        ? (line.tax_amount / (line.line_total - line.tax_amount)) * 100
        : 0,
    tax_amount: line.tax_amount,
    line_total: line.line_total,
    warehouse_id: line.warehouse_id,
    warehouse_name: line.warehouse?.name,
  }));
}

function mapToBackendLines(lines: OrderLine[]) {
  return lines.map((line) => ({
    product_id: line.product_id || undefined,
    description: line.description,
    quantity_ordered: line.quantity,
    uom_id: line.uom_id || "UND",
    unit_price: line.unit_price,
    discount_percent: line.discount_percent,
    tax_code_id: line.tax_code_id || undefined,
    warehouse_id: line.warehouse_id || undefined,
  }));
}

export default function EditSalesOrderPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const id = params.id as string;

  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: ["sales-order", id],
    queryFn: () => actions.findById(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<SalesOrder>) => actions.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales-order", id] });
      toast({ title: "Orden de venta actualizada exitosamente" });
      router.push("/dashboard/sales/sales-orders");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Error al actualizar la orden de venta", variant: "destructive" });
    },
  });

  const handleSubmit = (formData: Record<string, unknown>, lines: OrderLine[]) => {
    const dataWithLines = {
      ...formData,
      lines: mapToBackendLines(lines),
    } as Partial<SalesOrder>;

    updateMutation.mutate(dataWithLines);
  };

  const defaultLines = useMemo(
    () => (order ? mapToOrderLines(order.lines) : []),
    [order]
  );

  if (isLoadingOrder) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">Orden no encontrada</p>
        </div>
      </div>
    );
  }

  const canEdit = order.status === "draft" || order.status === "pending_approval";

  if (!canEdit) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Esta orden no puede ser editada en su estado actual
          </p>
        </div>
      </div>
    );
  }

  return (
    <OrderFormPage
      title="Editar Orden de Venta"
      subtitle="Modifica los datos de la orden de venta"
      backUrl="/dashboard/sales/sales-orders"
      formConfig={salesOrderFormConfig}
      defaultValues={order as unknown as Record<string, unknown>}
      defaultLines={defaultLines}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      searchProducts={searchProducts}
      searchWarehouses={searchWarehouses}
      searchUom={searchUom}
      searchTaxCodes={searchTaxCodes}
      warehouseLabel="Almacén Origen"
      currency="COP"
      orderNumber={order.order_number}
    />
  );
}
