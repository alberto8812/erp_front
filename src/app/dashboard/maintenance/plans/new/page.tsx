"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { PlanFormPage } from "../presentation/components/PlanFormPage";
import * as planActions from "../application/use-cases/maintenance-plan.actions";
import {
  searchAssetsForPlan,
  searchProductsForPlan,
} from "../application/use-cases/plan-search.actions";

export default function NewMaintenancePlanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: planActions.create,
    onSuccess: () => {
      toast({
        title: "Plan creado",
        description: "El plan de mantenimiento se ha creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["maintenance-plans"] });
      router.push("/dashboard/maintenance/plans");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el plan",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(data);
  };

  return (
    <PlanFormPage
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      searchAssets={searchAssetsForPlan}
      searchProducts={searchProductsForPlan}
    />
  );
}
