"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { VendorInvoiceFormPage } from "../presentation/components/VendorInvoiceFormPage";
import * as invoiceActions from "../application/use-cases/vendor-invoice.actions";
import { searchVendors } from "@/app/dashboard/masters/third-party/application/use-cases/vendor-search.action";
import { searchPaymentTerms } from "@/app/dashboard/masters/payment-terms/application/use-cases/payment-term-search.action";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchPurchaseOrders } from "@/app/dashboard/purchasing/purchase-orders/application/use-cases/purchase-order-search.action";

export default function NewVendorInvoicePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => invoiceActions.create(data),
    onSuccess: () => {
      toast({
        title: "Factura creada",
        description: "La factura de proveedor se ha creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["vendor-invoices"] });
      router.push("/dashboard/purchasing/vendor-invoices");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la factura",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(data);
  };

  return (
    <VendorInvoiceFormPage
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      searchVendors={searchVendors}
      searchProducts={searchProducts}
      searchPurchaseOrders={searchPurchaseOrders}
      searchPaymentTerms={searchPaymentTerms}
    />
  );
}
