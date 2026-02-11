"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { ArrowLeft, FileText, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFromOrder, createFromShipment } from "../application/use-cases/invoice.actions";

type CreateMode = "order" | "shipment" | null;

export default function NewInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<CreateMode>(null);
  const [orderId, setOrderId] = useState("");
  const [shipmentId, setShipmentId] = useState("");

  const createFromOrderMutation = useMutation({
    mutationFn: (id: string) => createFromOrder(id),
    onSuccess: (invoice) => {
      toast({ title: "Factura creada exitosamente" });
      router.push(`/dashboard/sales/invoices/${invoice.invoice_id}`);
    },
    onError: () => {
      toast({ title: "Error al crear la factura", variant: "destructive" });
    },
  });

  const createFromShipmentMutation = useMutation({
    mutationFn: (id: string) => createFromShipment(id),
    onSuccess: (invoice) => {
      toast({ title: "Factura creada exitosamente" });
      router.push(`/dashboard/sales/invoices/${invoice.invoice_id}`);
    },
    onError: () => {
      toast({ title: "Error al crear la factura", variant: "destructive" });
    },
  });

  const handleCreateFromOrder = () => {
    if (!orderId.trim()) {
      toast({ title: "Ingrese el ID de la orden", variant: "destructive" });
      return;
    }
    createFromOrderMutation.mutate(orderId);
  };

  const handleCreateFromShipment = () => {
    if (!shipmentId.trim()) {
      toast({ title: "Ingrese el ID del envío", variant: "destructive" });
      return;
    }
    createFromShipmentMutation.mutate(shipmentId);
  };

  const isPending = createFromOrderMutation.isPending || createFromShipmentMutation.isPending;

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
              onClick={() => router.push("/dashboard/sales/invoices")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Nueva Factura</h1>
              <p className="text-sm text-muted-foreground">
                Crear factura desde orden de venta o envío
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
                onClick={() => setMode("order")}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-2 p-3 rounded-full bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Desde Orden de Venta</CardTitle>
                  <CardDescription>
                    Crear factura basada en una orden de venta existente
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setMode("shipment")}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-2 p-3 rounded-full bg-chart-2/10">
                    <Package className="h-6 w-6 text-chart-2" />
                  </div>
                  <CardTitle className="text-lg">Desde Envío</CardTitle>
                  <CardDescription>
                    Crear factura basada en un envío realizado
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Create from Order Form */}
          {mode === "order" && (
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
                    <CardTitle>Crear desde Orden de Venta</CardTitle>
                    <CardDescription>
                      Ingrese el ID de la orden de venta para crear la factura
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">ID de Orden de Venta</Label>
                  <Input
                    id="orderId"
                    placeholder="Ej: 550e8400-e29b-41d4-a716-446655440000"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    disabled={isPending}
                  />
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
                    onClick={handleCreateFromOrder}
                    disabled={isPending || !orderId.trim()}
                  >
                    {createFromOrderMutation.isPending && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    )}
                    Crear Factura
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create from Shipment Form */}
          {mode === "shipment" && (
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
                    <CardTitle>Crear desde Envío</CardTitle>
                    <CardDescription>
                      Ingrese el ID del envío para crear la factura
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipmentId">ID de Envío</Label>
                  <Input
                    id="shipmentId"
                    placeholder="Ej: 550e8400-e29b-41d4-a716-446655440000"
                    value={shipmentId}
                    onChange={(e) => setShipmentId(e.target.value)}
                    disabled={isPending}
                  />
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
                    onClick={handleCreateFromShipment}
                    disabled={isPending || !shipmentId.trim()}
                  >
                    {createFromShipmentMutation.isPending && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    )}
                    Crear Factura
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
