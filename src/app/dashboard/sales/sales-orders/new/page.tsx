"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { OrderFormPage } from "@/shared/presentation/components/order-form";
import { salesOrderFormConfig } from "../presentation/forms/sales-order-form.config";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";
import { searchUom } from "@/app/dashboard/masters/uom/application/use-cases/uom-search.action";
import { searchTaxCodes } from "@/app/dashboard/masters/tax-codes/application/use-cases/tax-code-search.action";
import * as actions from "../application/use-cases/sales-order.actions";
import type { SalesOrder } from "../domain/entities/sales-order.entity";
import type { OrderLine } from "@/shared/presentation/components/order-lines";

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

export default function NewSalesOrderPage() {
  const router = useRouter();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: Partial<SalesOrder>) => actions.create(data),
    onSuccess: () => {
      toast({ title: "Orden de venta creada exitosamente" });
      router.push("/dashboard/sales/sales-orders");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message || "Error al crear la orden de venta", variant: "destructive" });
    },
  });

  const handleSubmit = (formData: Record<string, unknown>, lines: OrderLine[]) => {
    const dataWithLines = {
      ...formData,
      lines: mapToBackendLines(lines),
    } as Partial<SalesOrder>;

    createMutation.mutate(dataWithLines);
  };

  return (
    <OrderFormPage
      title="Nueva Orden de Venta"
      subtitle="Crea una nueva orden de venta para un cliente"
      backUrl="/dashboard/sales/sales-orders"
      formConfig={salesOrderFormConfig}
      defaultValues={{
        order_date: new Date().toISOString().split("T")[0],
        status: "draft",
        exchange_rate: 1,
      }}
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      searchProducts={searchProducts}
      searchWarehouses={searchWarehouses}
      searchUom={searchUom}
      searchTaxCodes={searchTaxCodes}
      warehouseLabel="Almacén Origen"
      currency="COP"
    />
  );
}
