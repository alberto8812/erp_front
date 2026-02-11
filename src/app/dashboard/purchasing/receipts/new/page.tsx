"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { ReceiptFormPage } from "../presentation/components/ReceiptFormPage";
import * as receiptActions from "../application/use-cases/receipt.actions";
import { searchPurchaseOrders } from "@/app/dashboard/purchasing/purchase-orders/application/use-cases/purchase-order-search.action";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";

// TODO: Implement location search within warehouse
async function searchLocations(query: string, warehouseId: string) {
  return [];
}

async function fetchOrderLines(orderId: string) {
  // TODO: Replace with actual API call
  return [];
}

export default function NewReceiptPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: { formData: any; lines: any[] }) =>
      receiptActions.create({ ...data.formData, lines: data.lines }),
    onSuccess: () => {
      toast({
        title: "Recepción creada",
        description: "La recepción se ha creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      router.push("/dashboard/purchasing/receipts");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la recepción",
        variant: "destructive",
      });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (data: any, lines: any[]) => {
    createMutation.mutate({ formData: data, lines });
  };

  return (
    <ReceiptFormPage
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      searchPurchaseOrders={searchPurchaseOrders}
      searchWarehouses={searchWarehouses}
      searchLocations={searchLocations}
      fetchOrderLines={fetchOrderLines}
    />
  );
}
