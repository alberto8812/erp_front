"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { ArrowLeft, RotateCcw, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFromReturn } from "../application/use-cases/credit-note.actions";

type CreateMode = "return" | "manual" | null;

export default function NewCreditNotePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<CreateMode>(null);
  const [returnId, setReturnId] = useState("");

  const createFromReturnMutation = useMutation({
    mutationFn: (id: string) => createFromReturn(id),
    onSuccess: (creditNote) => {
      toast({ title: "Nota de crédito creada exitosamente" });
      router.push(`/dashboard/sales/credit-notes/${creditNote.credit_note_id}`);
    },
    onError: () => {
      toast({ title: "Error al crear la nota de crédito", variant: "destructive" });
    },
  });

  const handleCreateFromReturn = () => {
    if (!returnId.trim()) {
      toast({ title: "Ingrese el ID de la devolución", variant: "destructive" });
      return;
    }
    createFromReturnMutation.mutate(returnId);
  };

  const isPending = createFromReturnMutation.isPending;

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => router.push("/dashboard/sales/credit-notes")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Nueva Nota de Crédito</h1>
              <p className="text-sm text-muted-foreground">
                Crear nota de crédito desde devolución o manualmente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Mode Selection */}
          {!mode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setMode("return")}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-2 p-3 rounded-full bg-primary/10">
                    <RotateCcw className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Desde Devolución</CardTitle>
                  <CardDescription>
                    Crear nota de crédito basada en una devolución (RMA) aprobada
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:border-primary transition-colors opacity-50"
                onClick={() => toast({ title: "Creación manual próximamente disponible" })}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-2 p-3 rounded-full bg-chart-2/10">
                    <FileText className="h-6 w-6 text-chart-2" />
                  </div>
                  <CardTitle className="text-lg">Creación Manual</CardTitle>
                  <CardDescription>
                    Crear nota de crédito manualmente (ajuste de precio, descuento, etc.)
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Create from Return Form */}
          {mode === "return" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setMode(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle>Crear desde Devolución</CardTitle>
                    <CardDescription>
                      Ingrese el ID de la devolución para crear la nota de crédito
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="returnId">ID de Devolución (RMA)</Label>
                  <Input
                    id="returnId"
                    placeholder="Ej: 550e8400-e29b-41d4-a716-446655440000"
                    value={returnId}
                    onChange={(e) => setReturnId(e.target.value)}
                    disabled={isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    La devolución debe estar en estado &quot;Procesada&quot; para crear la nota de crédito.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setMode(null)}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateFromReturn}
                    disabled={isPending || !returnId.trim()}
                  >
                    {createFromReturnMutation.isPending && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    )}
                    Crear Nota de Crédito
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
