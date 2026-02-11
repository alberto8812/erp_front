"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Gauge,
  Calendar,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Autocomplete } from "@/shared/presentation/components/autocomplete/Autocomplete";
import { cn } from "@/lib/utils";

const taskSchema = z.object({
  sequence: z.number().min(1),
  task_name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  estimated_minutes: z.number().min(0).optional(),
  is_mandatory: z.boolean().default(true),
  requires_measurement: z.boolean().default(false),
  measurement_unit: z.string().optional(),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  target_value: z.number().optional(),
  safety_instructions: z.string().optional(),
});

const sparePartSchema = z.object({
  product_id: z.string().min(1, "Producto requerido"),
  product_name: z.string().optional(),
  quantity: z.number().min(0.01, "Cantidad requerida"),
  is_mandatory: z.boolean().default(false),
  notes: z.string().optional(),
});

const planFormSchema = z.object({
  plan_code: z.string().min(1, "Código requerido"),
  plan_name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  asset_id: z.string().min(1, "Activo requerido"),
  frequency_type: z.enum(["time_based", "meter_based", "calendar_based", "hybrid"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  frequency_days: z.number().min(0).optional(),
  frequency_weeks: z.number().min(0).optional(),
  frequency_months: z.number().min(0).optional(),
  frequency_meter_value: z.number().min(0).optional(),
  meter_type: z.string().optional(),
  calendar_months: z.array(z.number()).optional(),
  calendar_day: z.number().min(1).max(31).optional(),
  estimated_duration_hours: z.number().min(0).optional(),
  estimated_duration_minutes: z.number().min(0).max(59).optional(),
  estimated_labor_cost: z.number().min(0).optional(),
  estimated_parts_cost: z.number().min(0).optional(),
  required_technicians: z.number().min(1).optional(),
  next_due_date: z.string().optional(),
  next_due_meter: z.number().optional(),
  advance_days: z.number().min(0).optional(),
  overdue_tolerance_days: z.number().min(0).optional(),
  auto_generate_wo: z.boolean().default(true),
  is_active: z.boolean().default(true),
  tasks: z.array(taskSchema).optional(),
  spare_parts: z.array(sparePartSchema).optional(),
});

type PlanFormData = z.infer<typeof planFormSchema>;

interface PlanFormPageProps {
  defaultValues?: Partial<PlanFormData> & {
    plan_id?: string;
    asset?: { asset_id: string; asset_code: string; asset_name: string };
  };
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  planCode?: string;
  searchAssets: (query: string) => Promise<{ asset_id: string; asset_code: string; asset_name: string }[]>;
  searchProducts: (query: string) => Promise<{ product_id: string; sku: string; name: string }[]>;
}

const frequencyTypeOptions = [
  { value: "time_based", label: "Basado en Tiempo", icon: Clock },
  { value: "meter_based", label: "Basado en Medidor", icon: Gauge },
  { value: "calendar_based", label: "Calendario", icon: Calendar },
  { value: "hybrid", label: "Híbrido", icon: Zap },
];

const priorityOptions = [
  { value: "critical", label: "Crítico", color: "text-destructive" },
  { value: "high", label: "Alto", color: "text-warning" },
  { value: "medium", label: "Medio", color: "text-primary" },
  { value: "low", label: "Bajo", color: "text-muted-foreground" },
];

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function PlanFormPage({
  defaultValues,
  onSubmit,
  isLoading,
  isEdit,
  planCode,
  searchAssets,
  searchProducts,
}: PlanFormPageProps) {
  const router = useRouter();
  const [selectedAsset, setSelectedAsset] = useState<{
    asset_id: string;
    asset_code: string;
    asset_name: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      plan_code: "",
      plan_name: "",
      description: "",
      asset_id: "",
      frequency_type: "time_based" as const,
      priority: "medium" as const,
      frequency_days: 0,
      frequency_weeks: 0,
      frequency_months: 0,
      frequency_meter_value: 0,
      meter_type: "",
      calendar_months: [] as number[],
      calendar_day: 1,
      estimated_duration_hours: 0,
      estimated_duration_minutes: 0,
      estimated_labor_cost: 0,
      estimated_parts_cost: 0,
      required_technicians: 1,
      next_due_date: "",
      next_due_meter: 0,
      advance_days: 7,
      overdue_tolerance_days: 3,
      auto_generate_wo: true,
      is_active: true,
      tasks: [] as z.infer<typeof taskSchema>[],
      spare_parts: [] as z.infer<typeof sparePartSchema>[],
      ...defaultValues,
    },
  });

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
    move: moveTask,
  } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  const {
    fields: sparePartFields,
    append: appendSparePart,
    remove: removeSparePart,
  } = useFieldArray({
    control: form.control,
    name: "spare_parts",
  });

  const frequencyType = form.watch("frequency_type");
  const calendarMonths = form.watch("calendar_months") || [];

  useEffect(() => {
    if (defaultValues?.asset_id && defaultValues.asset) {
      setSelectedAsset(defaultValues.asset);
    }
  }, [defaultValues]);

  const handleAssetChange = useCallback(
    (value: string) => {
      form.setValue("asset_id", value);
    },
    [form]
  );

  const handleAssetSelectOption = useCallback(
    (option: { code: string; value: string; meta: Record<string, unknown> } | null) => {
      if (option) {
        setSelectedAsset({
          asset_id: option.code,
          asset_code: option.meta.asset_code as string,
          asset_name: option.meta.asset_name as string,
        });
      } else {
        setSelectedAsset(null);
      }
    },
    []
  );

  const wrappedSearchAssets = useCallback(
    async (query: string) => {
      const results = await searchAssets(query);
      return results.map((asset) => ({
        code: asset.asset_id,
        value: `${asset.asset_code} - ${asset.asset_name}`,
        meta: {
          asset_code: asset.asset_code,
          asset_name: asset.asset_name,
        },
      }));
    },
    [searchAssets]
  );

  const wrappedSearchProducts = useCallback(
    async (query: string) => {
      const results = await searchProducts(query);
      return results.map((product) => ({
        code: product.product_id,
        value: `${product.sku} - ${product.name}`,
        meta: {
          sku: product.sku,
          name: product.name,
        },
      }));
    },
    [searchProducts]
  );

  const toggleMonth = (month: number) => {
    const current = calendarMonths || [];
    if (current.includes(month)) {
      form.setValue(
        "calendar_months",
        current.filter((m) => m !== month)
      );
    } else {
      form.setValue("calendar_months", [...current, month].sort((a, b) => a - b));
    }
  };

  const addTask = () => {
    appendTask({
      sequence: taskFields.length + 1,
      task_name: "",
      description: "",
      estimated_minutes: 15,
      is_mandatory: true,
      requires_measurement: false,
    });
  };

  const addSparePart = () => {
    appendSparePart({
      product_id: "",
      product_name: "",
      quantity: 1,
      is_mandatory: false,
      notes: "",
    });
  };

  const handleFormSubmit = (data: PlanFormData) => {
    // Calculate total cost
    const laborCost = data.estimated_labor_cost || 0;
    const partsCost = data.estimated_parts_cost || 0;

    const submitData = {
      ...data,
      estimated_total_cost: laborCost + partsCost,
    };

    onSubmit(submitData as Record<string, unknown>);
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">
              {isEdit ? `Editar Plan ${planCode}` : "Nuevo Plan de Mantenimiento"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEdit
                ? "Modifique los datos del plan preventivo"
                : "Configure un nuevo plan de mantenimiento preventivo"}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-1.5 h-4 w-4" />
          {isLoading ? "Guardando..." : "Guardar Plan"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Información General</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan_code">Código *</Label>
                  <Input
                    id="plan_code"
                    placeholder="MP-001"
                    {...form.register("plan_code")}
                    className={cn(form.formState.errors.plan_code && "border-destructive")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan_name">Nombre del Plan *</Label>
                  <Input
                    id="plan_name"
                    placeholder="Mantenimiento mensual compresor"
                    {...form.register("plan_name")}
                    className={cn(form.formState.errors.plan_name && "border-destructive")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción detallada del plan..."
                  rows={2}
                  {...form.register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label>Activo *</Label>
                <Autocomplete
                  placeholder="Buscar activo..."
                  searchAction={wrappedSearchAssets}
                  returnMode="code"
                  value={form.watch("asset_id")}
                  onChange={handleAssetChange}
                  onSelect={handleAssetSelectOption}
                  initialDisplayValue={
                    selectedAsset
                      ? `${selectedAsset.asset_code} - ${selectedAsset.asset_name}`
                      : undefined
                  }
                />
                {form.formState.errors.asset_id && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Seleccione un activo
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Frequency Configuration */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Configuración de Frecuencia</CardTitle>
              <CardDescription>
                Defina cuándo y con qué frecuencia se debe ejecutar el mantenimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Frecuencia</Label>
                  <Select
                    value={frequencyType}
                    onValueChange={(val) =>
                      form.setValue("frequency_type", val as PlanFormData["frequency_type"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon className="h-4 w-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select
                    value={form.watch("priority")}
                    onValueChange={(val) =>
                      form.setValue("priority", val as PlanFormData["priority"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span className={opt.color}>{opt.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time-based frequency */}
              {(frequencyType === "time_based" || frequencyType === "hybrid") && (
                <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <Label>Días</Label>
                    <Input
                      type="number"
                      min={0}
                      {...form.register("frequency_days", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Semanas</Label>
                    <Input
                      type="number"
                      min={0}
                      {...form.register("frequency_weeks", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meses</Label>
                    <Input
                      type="number"
                      min={0}
                      {...form.register("frequency_months", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}

              {/* Meter-based frequency */}
              {(frequencyType === "meter_based" || frequencyType === "hybrid") && (
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <Label>Valor de Medidor</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="1000"
                      {...form.register("frequency_meter_value", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Medidor</Label>
                    <Input placeholder="Horas, km, ciclos..." {...form.register("meter_type")} />
                  </div>
                </div>
              )}

              {/* Calendar-based frequency */}
              {frequencyType === "calendar_based" && (
                <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                  <div className="space-y-2">
                    <Label>Meses del Año</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {monthNames.map((name, idx) => (
                        <Button
                          key={idx}
                          type="button"
                          variant={calendarMonths.includes(idx + 1) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleMonth(idx + 1)}
                          className="text-xs"
                        >
                          {name.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 max-w-[150px]">
                    <Label>Día del Mes</Label>
                    <Input
                      type="number"
                      min={1}
                      max={31}
                      {...form.register("calendar_day", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Próxima Fecha de Vencimiento</Label>
                  <Input type="date" {...form.register("next_due_date")} />
                </div>
                {(frequencyType === "meter_based" || frequencyType === "hybrid") && (
                  <div className="space-y-2">
                    <Label>Próximo Vencimiento (Medidor)</Label>
                    <Input
                      type="number"
                      min={0}
                      {...form.register("next_due_meter", { valueAsNumber: true })}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Tareas del Plan</CardTitle>
                  <CardDescription>
                    Defina las tareas a realizar durante el mantenimiento
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addTask}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Agregar Tarea
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {taskFields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No hay tareas definidas</p>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={addTask}
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Agregar primera tarea
                  </Button>
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {taskFields.map((field, index) => (
                    <AccordionItem
                      key={field.id}
                      value={field.id}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-3 flex-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span className="font-medium">
                            {form.watch(`tasks.${index}.task_name`) || "Nueva tarea"}
                          </span>
                          {form.watch(`tasks.${index}.is_mandatory`) && (
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                              Obligatoria
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nombre de la Tarea *</Label>
                              <Input
                                placeholder="Inspeccionar filtro de aire"
                                {...form.register(`tasks.${index}.task_name`)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Tiempo Estimado (min)</Label>
                              <Input
                                type="number"
                                min={0}
                                {...form.register(`tasks.${index}.estimated_minutes`, {
                                  valueAsNumber: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Textarea
                              rows={2}
                              placeholder="Instrucciones detalladas..."
                              {...form.register(`tasks.${index}.description`)}
                            />
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={form.watch(`tasks.${index}.is_mandatory`)}
                                onCheckedChange={(val) =>
                                  form.setValue(`tasks.${index}.is_mandatory`, val)
                                }
                              />
                              <Label className="cursor-pointer">Obligatoria</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={form.watch(`tasks.${index}.requires_measurement`)}
                                onCheckedChange={(val) =>
                                  form.setValue(`tasks.${index}.requires_measurement`, val)
                                }
                              />
                              <Label className="cursor-pointer">Requiere Medición</Label>
                            </div>
                          </div>
                          {form.watch(`tasks.${index}.requires_measurement`) && (
                            <div className="grid grid-cols-4 gap-4 p-3 border rounded bg-muted/30">
                              <div className="space-y-2">
                                <Label className="text-xs">Unidad</Label>
                                <Input
                                  placeholder="PSI, °C..."
                                  {...form.register(`tasks.${index}.measurement_unit`)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Mín</Label>
                                <Input
                                  type="number"
                                  {...form.register(`tasks.${index}.min_value`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Objetivo</Label>
                                <Input
                                  type="number"
                                  {...form.register(`tasks.${index}.target_value`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Máx</Label>
                                <Input
                                  type="number"
                                  {...form.register(`tasks.${index}.max_value`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label>Instrucciones de Seguridad</Label>
                            <Textarea
                              rows={2}
                              placeholder="EPP requerido, precauciones..."
                              {...form.register(`tasks.${index}.safety_instructions`)}
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => removeTask(index)}
                            >
                              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                              Eliminar Tarea
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>

          {/* Spare Parts */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Repuestos Requeridos</CardTitle>
                  <CardDescription>
                    Liste los materiales y repuestos necesarios para el mantenimiento
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addSparePart}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Agregar Repuesto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {sparePartFields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No hay repuestos definidos</p>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={addSparePart}
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Agregar primer repuesto
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg divide-y">
                  {sparePartFields.map((field, index) => (
                    <div key={field.id} className="p-4 grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5 space-y-2">
                        <Label className="text-xs">Producto</Label>
                        <Autocomplete
                          placeholder="Buscar producto..."
                          searchAction={wrappedSearchProducts}
                          returnMode="code"
                          value={form.watch(`spare_parts.${index}.product_id`)}
                          onChange={(value) => {
                            form.setValue(`spare_parts.${index}.product_id`, value);
                          }}
                          onSelect={(option) => {
                            if (option) {
                              form.setValue(
                                `spare_parts.${index}.product_name`,
                                option.meta.name as string
                              );
                            }
                          }}
                          initialDisplayValue={
                            form.watch(`spare_parts.${index}.product_name`)
                              ? `${form.watch(`spare_parts.${index}.product_name`)}`
                              : undefined
                          }
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-xs">Cantidad</Label>
                        <Input
                          type="number"
                          min={0.01}
                          step={0.01}
                          {...form.register(`spare_parts.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <Switch
                          checked={form.watch(`spare_parts.${index}.is_mandatory`)}
                          onCheckedChange={(val) =>
                            form.setValue(`spare_parts.${index}.is_mandatory`, val)
                          }
                        />
                        <Label className="text-xs cursor-pointer">Obligatorio</Label>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-xs">Notas</Label>
                        <Input
                          placeholder="Opcional..."
                          {...form.register(`spare_parts.${index}.notes`)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-9 w-9"
                          onClick={() => removeSparePart(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Duration & Cost */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Duración y Costos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Horas Est.</Label>
                  <Input
                    type="number"
                    min={0}
                    {...form.register("estimated_duration_hours", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minutos Est.</Label>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    {...form.register("estimated_duration_minutes", { valueAsNumber: true })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Técnicos Requeridos</Label>
                <Input
                  type="number"
                  min={1}
                  {...form.register("required_technicians", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Mano de Obra Est.</Label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("estimated_labor_cost", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Repuestos Est.</Label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("estimated_parts_cost", { valueAsNumber: true })}
                />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Costo Total Estimado</span>
                  <span className="font-semibold tabular-nums">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(
                      (form.watch("estimated_labor_cost") || 0) +
                        (form.watch("estimated_parts_cost") || 0)
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label>Días de Anticipación</Label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("advance_days", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Días antes del vencimiento para notificar
                </p>
              </div>
              <div className="space-y-2">
                <Label>Tolerancia de Vencimiento</Label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("overdue_tolerance_days", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Días de tolerancia después del vencimiento
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-generar Orden de Trabajo</Label>
                  <p className="text-xs text-muted-foreground">
                    Crear OT automáticamente al vencer
                  </p>
                </div>
                <Switch
                  checked={form.watch("auto_generate_wo")}
                  onCheckedChange={(val) => form.setValue("auto_generate_wo", val)}
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <Label>Plan Activo</Label>
                  <p className="text-xs text-muted-foreground">
                    Desactive para pausar el plan
                  </p>
                </div>
                <Switch
                  checked={form.watch("is_active")}
                  onCheckedChange={(val) => form.setValue("is_active", val)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
