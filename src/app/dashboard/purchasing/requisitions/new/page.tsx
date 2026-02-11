"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { RequisitionFormPage } from "../presentation/components/RequisitionFormPage";
import * as requisitionActions from "../application/use-cases/requisition.actions";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchVendors } from "@/app/dashboard/masters/third-party/application/use-cases/vendor-search.action";
import { searchUom } from "@/app/dashboard/masters/uom/application/use-cases/uom-search.action";

// TODO: Implement these search actions
async function searchDepartments(query: string) {
  return [];
}

async function searchCostCenters(query: string) {
  return [];
}

export default function NewRequisitionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: { formData: any; lines: any[] }) =>
      requisitionActions.create({ ...data.formData, lines: data.lines }),
    onSuccess: () => {
      toast({
        title: "Requisición creada",
        description: "La requisición se ha creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
      router.push("/dashboard/purchasing/requisitions");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la requisición",
        variant: "destructive",
      });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (data: any, lines: any[]) => {
    createMutation.mutate({ formData: data, lines });
  };

  return (
    <RequisitionFormPage
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      searchProducts={searchProducts}
      searchDepartments={searchDepartments}
      searchCostCenters={searchCostCenters}
      searchVendors={searchVendors}
      searchUom={searchUom}
    />
  );
}
