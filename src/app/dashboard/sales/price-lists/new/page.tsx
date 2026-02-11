"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/hooks/use-toast";
import { Autocomplete } from "@/shared/presentation/components/autocomplete/Autocomplete";
import { searchCurrencies } from "@/app/dashboard/masters/currencies/application/use-cases/currency-search.action";
import { searchCustomers } from "@/app/dashboard/masters/third-party/application/use-cases/third-party-search.action";
import * as actions from "../application/use-cases/price-list.actions";
import type { PriceList } from "../domain/entities/price-list.entity";
import { z } from "zod";
import {
  PRICE_LIST_CUSTOMER_TYPE_OPTIONS,
  ROUNDING_RULE_OPTIONS,
} from "../../shared/types/sales.types";

const formSchema = z.object({
  code: z.string().min(1, "Código es requerido").max(20),
  name: z.string().min(1, "Nombre es requerido").max(100),
  currency: z.string().min(1, "Moneda es requerida"),
  priority: z.coerce.number().min(1).max(100),
  effective_from: z.string().min(1, "Fecha de inicio es requerida"),
  effective_to: z.string().optional(),
  customer_type: z.string().optional(),
  customer_id: z.string().optional(),
  discount_percent: z.coerce.number().min(0).max(100).optional(),
  markup_percent: z.coerce.number().min(0).optional(),
  rounding_rule: z.string().optional(),
  rounding_precision: z.coerce.number().min(0).max(4).optional(),
  is_default: z.boolean(),
  is_active: z.boolean(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function NewPriceListPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      currency: "COP",
      priority: 10,
      effective_from: new Date().toISOString().split("T")[0],
      customer_type: "all",
      rounding_rule: "none",
      rounding_precision: 2,
      is_default: false,
      is_active: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<PriceList>) => actions.create(data),
    onSuccess: (result) => {
      toast({ title: "Lista de precios creada exitosamente" });
      router.push(`/dashboard/sales/price-lists/${(result as PriceList).price_list_id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la lista de precios",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: FormData) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== "" && v !== undefined && v !== null)
    );
    createMutation.mutate(cleanData as Partial<PriceList>);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push("/dashboard/sales/price-lists")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Nueva Lista de Precios</h1>
                <p className="text-sm text-muted-foreground">
                  Crea una nueva lista de precios para clientes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/sales/price-lists")}
                disabled={createMutation.isPending}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                form="price-list-form"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                )}
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          id="price-list-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex-1 overflow-auto p-6"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* General Info */}
            <Card>
              <CardContent className="p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
                  Información General
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Código *</FormLabel>
                        <FormControl>
                          <Input placeholder="PL-001" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-xs">Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Lista General" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Prioridad</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={100} {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Currency & Dates */}
            <Card>
              <CardContent className="p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
                  Moneda y Vigencia
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Moneda *</FormLabel>
                        <FormControl>
                          <Autocomplete
                            searchAction={searchCurrencies}
                            returnMode="code"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Buscar moneda..."
                            queryKeyPrefix="currency"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="effective_from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Vigente Desde *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="effective_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Vigente Hasta</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Type */}
            <Card>
              <CardContent className="p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
                  Aplicación
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customer_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tipo de Cliente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PRICE_LIST_CUSTOMER_TYPE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Cliente Específico</FormLabel>
                        <FormControl>
                          <Autocomplete
                            searchAction={searchCustomers}
                            returnMode="code"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Dejar vacío para todos..."
                            queryKeyPrefix="customer"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Opcional. Si se selecciona, aplica solo a este cliente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Config */}
            <Card>
              <CardContent className="p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
                  Configuración de Precios
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="discount_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Descuento General (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={100} step={0.1} {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="markup_percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Margen (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={0.1} {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rounding_rule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Redondeo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ROUNDING_RULE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rounding_precision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Decimales</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={4} {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardContent className="p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
                  Opciones
                </p>
                <div className="flex flex-wrap gap-6">
                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Lista por Defecto
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Activa
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent className="p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
                  Notas
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción de la lista de precios..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Notas Adicionales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notas internas..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
