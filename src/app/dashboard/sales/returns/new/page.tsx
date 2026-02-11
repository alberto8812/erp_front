"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { OrderFormPage } from "@/shared/presentation/components/order-form";
import { returnFormConfig } from "../presentation/forms/return-form.config";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchUom } from "@/app/dashboard/masters/uom/application/use-cases/uom-search.action";
import * as actions from "../application/use-cases/return.actions";
import type { SalesReturn } from "../domain/entities/return.entity";
import type { OrderLine } from "@/shared/presentation/components/order-lines";

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

export default function NewReturnPage() {
  const router = useRouter();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: Partial<SalesReturn>) => actions.create(data),
    onSuccess: () => {
      toast({ title: "Devolución creada exitosamente" });
      router.push("/dashboard/sales/returns");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la devolución",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (formData: Record<string, unknown>, lines: OrderLine[]) => {
    const dataWithLines = {
      ...formData,
      lines: mapToBackendLines(lines),
    } as Partial<SalesReturn>;

    createMutation.mutate(dataWithLines);
  };

  return (
    <OrderFormPage
      title="Nueva Devolución"
      subtitle="Registra una nueva devolución de cliente (RMA)"
      backUrl="/dashboard/sales/returns"
      formConfig={returnFormConfig}
      defaultValues={{
        return_date: new Date().toISOString().split("T")[0],
        status: "draft",
        exchange_rate: 1,
        reason_code: "other",
      }}
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      searchProducts={searchProducts}
      searchUom={searchUom}
      currency="COP"
    />
  );
}
