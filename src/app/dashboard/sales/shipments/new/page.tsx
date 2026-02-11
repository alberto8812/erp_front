"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { ShipmentFormPage } from "../presentation/components/ShipmentFormPage";
import * as shipmentActions from "../application/use-cases/shipment.actions";
import { searchSalesOrders } from "@/app/dashboard/sales/sales-orders/application/use-cases/sales-order-search.action";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";
import { getAvailableLots } from "@/app/dashboard/inventory/lots/application/use-cases/lot.actions";
import type { InventoryLot } from "../presentation/components/LotSerialPickerModal";

// TODO: These should be actual search actions
async function searchCarriers(query: string) {
  // Mock implementation - replace with actual search
  return [
    { code: "1", value: "Servientrega", meta: {} },
    { code: "2", value: "Coordinadora", meta: {} },
    { code: "3", value: "TCC", meta: {} },
    { code: "4", value: "Envia", meta: {} },
  ].filter((c) => c.value.toLowerCase().includes(query.toLowerCase()));
}

async function fetchOrderLines(orderId: string) {
  // TODO: Replace with actual API call
  // This should fetch the pending lines from a sales order
  return [];
}

async function fetchAvailableLots(
  productId: string,
  warehouseId: string,
  strategy: "FIFO" | "FEFO" = "FIFO"
): Promise<InventoryLot[]> {
  try {
    const lots = await getAvailableLots({
      product_id: productId,
      warehouse_id: warehouseId,
      strategy,
    });
    return lots;
  } catch (error) {
    console.error("Error fetching available lots:", error);
    return [];
  }
}

export default function NewShipmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: { formData: any; lines: any[] }) =>
      shipmentActions.create({ ...data.formData, lines: data.lines }),
    onSuccess: () => {
      toast({
        title: "Despacho creado",
        description: "El despacho se ha creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      router.push("/dashboard/sales/shipments");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el despacho",
        variant: "destructive",
      });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (data: any, lines: any[]) => {
    createMutation.mutate({ formData: data, lines });
  };

  return (
    <ShipmentFormPage
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      searchSalesOrders={searchSalesOrders}
      searchWarehouses={searchWarehouses}
      searchCarriers={searchCarriers}
      fetchOrderLines={fetchOrderLines}
      fetchAvailableLots={fetchAvailableLots}
    />
  );
}
