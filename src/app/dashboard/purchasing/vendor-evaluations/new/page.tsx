"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { VendorEvaluationFormPage } from "../presentation/components/VendorEvaluationFormPage";
import * as evaluationActions from "../application/use-cases/vendor-evaluation.actions";
import { searchVendors } from "@/app/dashboard/masters/third-party/application/use-cases/vendor-search.action";

export default function NewVendorEvaluationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      evaluationActions.create(data),
    onSuccess: () => {
      toast({
        title: "Evaluación creada",
        description: "La evaluación de proveedor se ha creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["vendor-evaluations"] });
      router.push("/dashboard/purchasing/vendor-evaluations");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la evaluación",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(data);
  };

  return (
    <VendorEvaluationFormPage
      onSubmit={handleSubmit}
      isLoading={createMutation.isPending}
      searchVendors={searchVendors}
    />
  );
}
