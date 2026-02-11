"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { OrderFormPage } from "@/shared/presentation/components/order-form";
import { quotationFormConfig } from "../presentation/forms/quotation-form.config";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchUom } from "@/app/dashboard/masters/uom/application/use-cases/uom-search.action";
import { searchTaxCodes } from "@/app/dashboard/masters/tax-codes/application/use-cases/tax-code-search.action";
import * as actions from "../application/use-cases/quotation.actions";
import type { Quotation } from "../domain/entities/quotation.entity";
import type { OrderLine } from "@/shared/presentation/components/order-lines";

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

export default function NewQuotationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Quotation>) => actions.create(data),
    onSuccess: () => {
      toast({ title: "Cotización creada exitosamente" });
      router.push("/dashboard/sales/quotations");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la cotización",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (formData: Record<string, unknown>, lines: OrderLine[]) => {
    const dataWithLines = {
      ...formData,
      lines: mapToBackendLines(lines),
    } as Partial<Quotation>;

    createMutation.mutate(dataWithLines);
  };

  return (
    <OrderFormPage
      title="Nueva Cotización"
      subtitle="Crea una nueva cotización para un cliente"
      backUrl="/dashboard/sales/quotations"
      formConfig={quotationFormConfig}
      defaultValues={{
        quotation_date: new Date().toISOString().split("T")[0],
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "draft",
        exchange_rate: 1,
      }}
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      searchProducts={searchProducts}
      searchUom={searchUom}
      searchTaxCodes={searchTaxCodes}
      currency="COP"
    />
  );
}
