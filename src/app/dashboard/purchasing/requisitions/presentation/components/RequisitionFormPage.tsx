"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  ClipboardList,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowUp,
  Minus,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Autocomplete } from "@/shared/presentation/components/autocomplete/Autocomplete";
import type { Requisition, RequisitionLine, RequisitionPriority } from "../../domain/entities/requisition.entity";
import type { AutocompleteOption } from "@/shared/presentation/types/autocomplete.types";

const requisitionSchema = z.object({
  requisition_date: z.string().min(1, "Fecha requerida"),
  required_date: z.string().optional(),
  department_id: z.string().optional(),
  cost_center_id: z.string().optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  justification: z.string().optional(),
  notes: z.string().optional(),
  internal_notes: z.string().optional(),
});

type RequisitionFormData = z.infer<typeof requisitionSchema>;

interface RequisitionLineData {
  id: string;
  line_number: number;
  product_id: string;
  product_name?: string;
  product_sku?: string;
  description: string;
  quantity_requested: number;
  uom_id?: string;
  uom_name?: string;
  estimated_unit_cost: number;
  required_date?: string;
  preferred_vendor_id?: string;
  preferred_vendor_name?: string;
  notes?: string;
}

interface RequisitionFormPageProps {
  defaultValues?: Partial<Requisition>;
  defaultLines?: RequisitionLineData[];
  onSubmit: (data: RequisitionFormData, lines: RequisitionLineData[]) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  requisitionNumber?: string;
  searchProducts: (query: string) => Promise<AutocompleteOption[]>;
  searchDepartments: (query: string) => Promise<AutocompleteOption[]>;
  searchCostCenters: (query: string) => Promise<AutocompleteOption[]>;
  searchVendors: (query: string) => Promise<AutocompleteOption[]>;
  searchUom: (query: string) => Promise<AutocompleteOption[]>;
}

function createEmptyLine(lineNumber: number): RequisitionLineData {
  return {
    id: `new-${Date.now()}-${lineNumber}`,
    line_number: lineNumber,
    product_id: "",
    description: "",
    quantity_requested: 1,
    estimated_unit_cost: 0,
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function RequisitionFormPage({
  defaultValues,
  defaultLines = [],
  onSubmit,
  isLoading,
  isEdit,
  requisitionNumber,
  searchProducts,
  searchDepartments,
  searchCostCenters,
  searchVendors,
  searchUom,
}: RequisitionFormPageProps) {
  const router = useRouter();
  const [lines, setLines] = useState<RequisitionLineData[]>(
    defaultLines.length > 0 ? defaultLines : [createEmptyLine(1)]
  );
  const [selectedDeptName, setSelectedDeptName] = useState<string | undefined>(
    defaultValues?.department?.name
  );
  const [selectedCCName, setSelectedCCName] = useState<string | undefined>(
    defaultValues?.cost_center?.name
  );

  const form = useForm<RequisitionFormData>({
    resolver: zodResolver(requisitionSchema),
    defaultValues: {
      requisition_date: defaultValues?.requisition_date || new Date().toISOString().split("T")[0],
      required_date: defaultValues?.required_date || "",
      department_id: defaultValues?.department_id || "",
      cost_center_id: defaultValues?.cost_center_id || "",
      priority: defaultValues?.priority || "normal",
      justification: defaultValues?.justification || "",
      notes: defaultValues?.notes || "",
      internal_notes: defaultValues?.internal_notes || "",
    },
  });

  const handleAddLine = useCallback(() => {
    setLines(prev => [...prev, createEmptyLine(prev.length + 1)]);
  }, []);

  const handleRemoveLine = useCallback((id: string) => {
    setLines(prev => {
      const updated = prev.filter(line => line.id !== id);
      return updated.map((line, idx) => ({ ...line, line_number: idx + 1 }));
    });
  }, []);

  const handleLineChange = useCallback((id: string, field: keyof RequisitionLineData, value: unknown) => {
    setLines(prev => prev.map(line => {
      if (line.id !== id) return line;
      return { ...line, [field]: value };
    }));
  }, []);

  const handleProductSelect = useCallback((id: string, option: AutocompleteOption | null) => {
    if (!option) return;
    setLines(prev => prev.map(line => {
      if (line.id !== id) return line;
      return {
        ...line,
        product_id: option.code,
        product_name: option.value,
        product_sku: option.meta?.sku as string | undefined,
        description: option.value,
        estimated_unit_cost: (option.meta?.base_price as number) || 0,
      };
    }));
  }, []);

  const handleVendorSelect = useCallback((id: string, option: AutocompleteOption | null) => {
    if (!option) return;
    setLines(prev => prev.map(line => {
      if (line.id !== id) return line;
      return {
        ...line,
        preferred_vendor_id: option.code,
        preferred_vendor_name: option.value,
      };
    }));
  }, []);

  const handleSubmit = useCallback((data: RequisitionFormData) => {
    onSubmit(data, lines);
  }, [lines, onSubmit]);

  const totalLines = lines.length;
  const totalEstimated = lines.reduce(
    (sum, line) => sum + line.quantity_requested * line.estimated_unit_cost,
    0
  );

  const getPriorityInfo = (priority: RequisitionPriority) => {
    switch (priority) {
      case "urgent":
        return { label: "Urgente", icon: AlertTriangle, color: "text-destructive" };
      case "high":
        return { label: "Alta", icon: ArrowUp, color: "text-warning" };
      case "normal":
        return { label: "Normal", icon: Minus, color: "text-muted-foreground" };
      case "low":
        return { label: "Baja", icon: ArrowDown, color: "text-muted-foreground" };
    }
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
                onClick={() => router.push("/dashboard/purchasing/requisitions")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {isEdit ? "Editar Requisición" : "Nueva Requisición"}
                  </h1>
                  {requisitionNumber && (
                    <span className="text-sm font-mono text-muted-foreground">
                      #{requisitionNumber}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Solicitud de compra interna
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/purchasing/requisitions")}
                disabled={isLoading}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                form="requisition-form"
                disabled={isLoading || lines.length === 0}
              >
                {isLoading ? (
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

      {/* Main Content */}
      <Form {...form}>
        <form
          id="requisition-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex-1 overflow-auto"
        >
          <div className="p-6 space-y-6">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-8">
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Información de la Requisición
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="requisition_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Fecha <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="date" className="h-9" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="required_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Fecha Requerida
                            </FormLabel>
                            <FormControl>
                              <Input type="date" className="h-9" {...field} disabled={isLoading} />
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
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Prioridad
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Baja</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                                <SelectItem value="urgent">Urgente</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div />
                      <FormField
                        control={form.control}
                        name="department_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Departamento
                            </FormLabel>
                            <FormControl>
                              <Autocomplete
                                searchAction={searchDepartments}
                                returnMode="code"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onSelect={(opt) => opt && setSelectedDeptName(opt.value)}
                                placeholder="Departamento..."
                                disabled={isLoading}
                                initialDisplayValue={selectedDeptName}
                                queryKeyPrefix="department"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cost_center_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Centro de Costo
                            </FormLabel>
                            <FormControl>
                              <Autocomplete
                                searchAction={searchCostCenters}
                                returnMode="code"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onSelect={(opt) => opt && setSelectedCCName(opt.value)}
                                placeholder="Centro de costo..."
                                disabled={isLoading}
                                initialDisplayValue={selectedCCName}
                                queryKeyPrefix="cost-center"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="justification"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Justificación
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Motivo de la requisición..."
                                  rows={2}
                                  className="resize-none"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Summary */}
              <div className="lg:col-span-4">
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] sticky top-24">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-success" />
                  <CardContent className="p-5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
                      Resumen
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Líneas</span>
                        <span className="font-semibold tabular-nums">{totalLines}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Estimado</span>
                          <span className="font-mono text-lg font-semibold tabular-nums tracking-tight">
                            {formatCurrency(totalEstimated)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Lines Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Productos Solicitados
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLine}
                  disabled={isLoading}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Agregar Línea
                </Button>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-12 text-center text-xs font-medium uppercase tracking-wide">
                          #
                        </TableHead>
                        <TableHead className="min-w-[200px] text-xs font-medium uppercase tracking-wide">
                          Producto
                        </TableHead>
                        <TableHead className="min-w-[150px] text-xs font-medium uppercase tracking-wide">
                          Descripción
                        </TableHead>
                        <TableHead className="w-24 text-center text-xs font-medium uppercase tracking-wide">
                          Cantidad
                        </TableHead>
                        <TableHead className="w-28 text-right text-xs font-medium uppercase tracking-wide">
                          Costo Est.
                        </TableHead>
                        <TableHead className="min-w-[180px] text-xs font-medium uppercase tracking-wide">
                          Proveedor Preferido
                        </TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell className="text-center text-sm font-mono text-muted-foreground">
                            {line.line_number}
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              searchAction={searchProducts}
                              returnMode="code"
                              value={line.product_id}
                              onChange={(val) => handleLineChange(line.id, "product_id", val)}
                              onSelect={(opt) => handleProductSelect(line.id, opt)}
                              placeholder="Buscar producto..."
                              disabled={isLoading}
                              initialDisplayValue={line.product_name}
                              queryKeyPrefix={`product-${line.id}`}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={line.description}
                              onChange={(e) => handleLineChange(line.id, "description", e.target.value)}
                              placeholder="Descripción"
                              className="h-9"
                              disabled={isLoading}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={line.quantity_requested}
                              onChange={(e) => handleLineChange(line.id, "quantity_requested", e.target.valueAsNumber || 1)}
                              className="h-9 w-20 text-center tabular-nums mx-auto"
                              disabled={isLoading}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step={100}
                              value={line.estimated_unit_cost}
                              onChange={(e) => handleLineChange(line.id, "estimated_unit_cost", e.target.valueAsNumber || 0)}
                              className="h-9 text-right tabular-nums"
                              disabled={isLoading}
                            />
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              searchAction={searchVendors}
                              returnMode="code"
                              value={line.preferred_vendor_id || ""}
                              onChange={(val) => handleLineChange(line.id, "preferred_vendor_id", val)}
                              onSelect={(opt) => handleVendorSelect(line.id, opt)}
                              placeholder="Proveedor..."
                              disabled={isLoading}
                              initialDisplayValue={line.preferred_vendor_name}
                              queryKeyPrefix={`vendor-${line.id}`}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveLine(line.id)}
                              disabled={isLoading || lines.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Notas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas adicionales..."
                        rows={3}
                        className="resize-none"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="internal_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Notas Internas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas internas..."
                        rows={3}
                        className="resize-none"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
