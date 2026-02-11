"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  Building2,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Autocomplete } from "@/shared/presentation/components/autocomplete/Autocomplete";
import type { VendorEvaluation, VendorClassification } from "../../domain/entities/vendor-evaluation.entity";
import type { AutocompleteOption } from "@/shared/presentation/types/autocomplete.types";
import {
  getVendorClassificationLabel,
  getVendorClassificationColor,
} from "../../../shared/types/purchasing.types";

const evaluationSchema = z.object({
  vendor_id: z.string().min(1, "Proveedor requerido"),
  evaluation_date: z.string().min(1, "Fecha de evaluación requerida"),
  period_start: z.string().min(1, "Inicio del período requerido"),
  period_end: z.string().min(1, "Fin del período requerido"),
  quality_score: z.number().min(0).max(100),
  delivery_score: z.number().min(0).max(100),
  price_score: z.number().min(0).max(100),
  communication_score: z.number().min(0).max(100),
  documentation_score: z.number().min(0).max(100),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  improvement_areas: z.string().optional(),
  recommendations: z.string().optional(),
  notes: z.string().optional(),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

interface VendorEvaluationFormPageProps {
  defaultValues?: Partial<VendorEvaluation>;
  onSubmit: (data: EvaluationFormData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  evaluationNumber?: string;
  searchVendors: (query: string) => Promise<AutocompleteOption[]>;
}

function calculateClassification(score: number): VendorClassification {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

function ScoreSlider({
  label,
  description,
  value,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return TrendingUp;
    if (score >= 40) return Minus;
    return TrendingDown;
  };

  const Icon = getScoreIcon(value);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`flex items-center gap-2 ${getScoreColor(value)}`}>
          <Icon className="h-4 w-4" />
          <span className="font-mono text-lg font-semibold tabular-nums">{value}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <Input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Math.min(100, Math.max(0, e.target.valueAsNumber || 0)))}
          className="w-16 h-8 text-center tabular-nums"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export function VendorEvaluationFormPage({
  defaultValues,
  onSubmit,
  isLoading,
  isEdit,
  evaluationNumber,
  searchVendors,
}: VendorEvaluationFormPageProps) {
  const router = useRouter();
  const [selectedVendorName, setSelectedVendorName] = useState<string | undefined>(
    defaultValues?.vendor?.comercial_name || defaultValues?.vendor?.legal_name
  );

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      vendor_id: defaultValues?.vendor_id || "",
      evaluation_date: defaultValues?.evaluation_date || new Date().toISOString().split("T")[0],
      period_start: defaultValues?.period_start || "",
      period_end: defaultValues?.period_end || "",
      quality_score: defaultValues?.quality_score || 70,
      delivery_score: defaultValues?.delivery_score || 70,
      price_score: defaultValues?.price_score || 70,
      communication_score: defaultValues?.communication_score || 70,
      documentation_score: defaultValues?.documentation_score || 70,
      strengths: defaultValues?.strengths || "",
      weaknesses: defaultValues?.weaknesses || "",
      improvement_areas: defaultValues?.improvement_areas || "",
      recommendations: defaultValues?.recommendations || "",
      notes: defaultValues?.notes || "",
    },
  });

  const qualityScore = form.watch("quality_score");
  const deliveryScore = form.watch("delivery_score");
  const priceScore = form.watch("price_score");
  const communicationScore = form.watch("communication_score");
  const documentationScore = form.watch("documentation_score");

  // Calculate overall score with weights
  const overallScore = Math.round(
    qualityScore * 0.30 +      // Quality: 30%
    deliveryScore * 0.25 +     // Delivery: 25%
    priceScore * 0.20 +        // Price: 20%
    communicationScore * 0.15 + // Communication: 15%
    documentationScore * 0.10   // Documentation: 10%
  );

  const classification = calculateClassification(overallScore);

  const handleVendorSelect = useCallback((option: AutocompleteOption | null) => {
    if (option) {
      setSelectedVendorName(option.value);
    }
  }, []);

  const handleSubmit = useCallback((data: EvaluationFormData) => {
    onSubmit(data);
  }, [onSubmit]);

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
                onClick={() => router.push("/dashboard/purchasing/vendor-evaluations")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {isEdit ? "Editar Evaluación" : "Nueva Evaluación de Proveedor"}
                  </h1>
                  {evaluationNumber && (
                    <span className="text-sm font-mono text-muted-foreground">
                      #{evaluationNumber}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Evalúa el desempeño del proveedor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/purchasing/vendor-evaluations")}
                disabled={isLoading}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                form="evaluation-form"
                disabled={isLoading}
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
          id="evaluation-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex-1 overflow-auto"
        >
          <div className="p-6 space-y-6">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Vendor & Period */}
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Proveedor y Período
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="vendor_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Proveedor <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Autocomplete
                                  searchAction={searchVendors}
                                  returnMode="code"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onSelect={handleVendorSelect}
                                  placeholder="Buscar proveedor..."
                                  disabled={isLoading || isEdit}
                                  initialDisplayValue={selectedVendorName}
                                  queryKeyPrefix="vendor"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="evaluation_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Fecha de Evaluación <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="date" className="h-9" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div />
                      <FormField
                        control={form.control}
                        name="period_start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Inicio del Período <span className="text-destructive">*</span>
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
                        name="period_end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Fin del Período <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="date" className="h-9" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Score Categories */}
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-chart-2" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-6">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Puntuaciones por Categoría
                      </p>
                    </div>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="quality_score"
                        render={({ field }) => (
                          <ScoreSlider
                            label="Calidad (30%)"
                            description="Conformidad de productos, defectos, certificaciones"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="delivery_score"
                        render={({ field }) => (
                          <ScoreSlider
                            label="Entrega (25%)"
                            description="Puntualidad, cantidades correctas, embalaje"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price_score"
                        render={({ field }) => (
                          <ScoreSlider
                            label="Precio (20%)"
                            description="Competitividad, estabilidad, transparencia"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="communication_score"
                        render={({ field }) => (
                          <ScoreSlider
                            label="Comunicación (15%)"
                            description="Respuesta, disponibilidad, resolución de problemas"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="documentation_score"
                        render={({ field }) => (
                          <ScoreSlider
                            label="Documentación (10%)"
                            description="Facturas, certificados, hojas técnicas"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        )}
                      />
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
                      Resultado de Evaluación
                    </p>

                    {/* Overall Score */}
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-3">
                        <span className="text-4xl font-bold tabular-nums tracking-tight">
                          {overallScore}
                        </span>
                      </div>
                      <Progress value={overallScore} className="h-2 mb-4" />
                      <Badge
                        variant="outline"
                        className={`${getVendorClassificationColor(classification)} border-0 text-lg font-bold px-4 py-1`}
                      >
                        {getVendorClassificationLabel(classification)}
                      </Badge>
                    </div>

                    {/* Score breakdown */}
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Calidad</span>
                        <span className="font-mono tabular-nums">{qualityScore} × 30%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Entrega</span>
                        <span className="font-mono tabular-nums">{deliveryScore} × 25%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Precio</span>
                        <span className="font-mono tabular-nums">{priceScore} × 20%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Comunicación</span>
                        <span className="font-mono tabular-nums">{communicationScore} × 15%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Documentación</span>
                        <span className="font-mono tabular-nums">{documentationScore} × 10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Observations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="strengths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Fortalezas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Aspectos positivos del proveedor..."
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
                name="weaknesses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Debilidades
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Aspectos a mejorar..."
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
                name="improvement_areas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Áreas de Mejora
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Oportunidades de mejora identificadas..."
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
                name="recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Recomendaciones
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Acciones recomendadas..."
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
