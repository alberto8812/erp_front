"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { VendorInvoiceFormPage } from "../../presentation/components/VendorInvoiceFormPage";
import * as invoiceActions from "../../application/use-cases/vendor-invoice.actions";
import { searchVendors } from "@/app/dashboard/masters/third-party/application/use-cases/vendor-search.action";
import { searchPaymentTerms } from "@/app/dashboard/masters/payment-terms/application/use-cases/payment-term-search.action";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchPurchaseOrders } from "@/app/dashboard/purchasing/purchase-orders/application/use-cases/purchase-order-search.action";

export default function EditVendorInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invoiceId = params.id as string;

  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ["vendor-invoices", invoiceId],
    queryFn: () => invoiceActions.findById(invoiceId),
    enabled: !!invoiceId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      invoiceActions.update(invoiceId, data),
    onSuccess: () => {
      toast({
        title: "Factura actualizada",
        description: "La factura de proveedor se ha actualizado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["vendor-invoices"] });
      router.push("/dashboard/purchasing/vendor-invoices");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la factura",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: Record<string, unknown>) => {
    updateMutation.mutate(data);
  };

  if (isLoadingInvoice) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-muted-foreground">Factura no encontrada</p>
      </div>
    );
  }

  return (
    <VendorInvoiceFormPage
      defaultValues={invoice}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      isEdit
      invoiceNumber={invoice.invoice_number}
      searchVendors={searchVendors}
      searchProducts={searchProducts}
      searchPurchaseOrders={searchPurchaseOrders}
      searchPaymentTerms={searchPaymentTerms}
    />
  );
}
