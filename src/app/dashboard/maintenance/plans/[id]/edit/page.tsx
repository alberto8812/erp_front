"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PlanFormPage } from "../../presentation/components/PlanFormPage";
import * as planActions from "../../application/use-cases/maintenance-plan.actions";
import {
  searchAssetsForPlan,
  searchProductsForPlan,
} from "../../application/use-cases/plan-search.actions";

export default function EditMaintenancePlanPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const planId = params.id as string;

  const { data: plan, isLoading: isLoadingPlan } = useQuery({
    queryKey: ["maintenance-plans", planId],
    queryFn: () => planActions.findById(planId),
    enabled: !!planId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      planActions.update(planId, data),
    onSuccess: () => {
      toast({
        title: "Plan actualizado",
        description: "El plan de mantenimiento se ha actualizado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["maintenance-plans"] });
      router.push("/dashboard/maintenance/plans");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el plan",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: Record<string, unknown>) => {
    updateMutation.mutate(data);
  };

  if (isLoadingPlan) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-muted-foreground">Plan no encontrado</p>
      </div>
    );
  }

  return (
    <PlanFormPage
      defaultValues={plan}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      isEdit
      planCode={plan.plan_code}
      searchAssets={searchAssetsForPlan}
      searchProducts={searchProductsForPlan}
    />
  );
}
