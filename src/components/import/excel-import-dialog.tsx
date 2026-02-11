"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  X,
  FileWarning,
  Table2,
  Eye,
  Zap,
  Check,
  AlertTriangle,
} from "lucide-react";
import { ImportErrorTable } from "./import-error-table";
import { ImportPreviewTable } from "./import-preview-table";
import { ImportFieldsInfo } from "./import-fields-info";
import {
  uploadPreview,
  type ImportPreviewResult,
} from "@/action/import/upload-preview.action";
import { downloadTemplate } from "@/action/import/download-template.action";
import { confirmImport } from "@/action/import/confirm-import.action";
import {
  pollJobStatus,
  type JobStatusResult,
} from "@/action/import/poll-job-status.action";

type Step = "upload" | "preview" | "processing" | "completed" | "failed";

const STEPS: { key: Step; label: string; icon: typeof Upload }[] = [
  { key: "upload", label: "Subir", icon: Upload },
  { key: "preview", label: "Revisar", icon: Eye },
  { key: "processing", label: "Procesar", icon: Zap },
];

function SpreadsheetIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Paper shadow */}
      <rect
        x="14"
        y="14"
        width="52"
        height="60"
        rx="4"
        className="fill-slate-200/60 dark:fill-slate-800/40"
      />
      {/* Paper */}
      <rect
        x="10"
        y="10"
        width="52"
        height="60"
        rx="4"
        className="fill-white dark:fill-zinc-800 stroke-slate-200 dark:stroke-slate-700"
        strokeWidth="1.5"
      />
      {/* Header row */}
      <rect
        x="14"
        y="14"
        width="44"
        height="8"
        rx="1"
        className="fill-primary/10"
      />
      {/* Grid lines */}
      <line
        x1="14"
        y1="26"
        x2="58"
        y2="26"
        strokeWidth="0.5"
        className="stroke-slate-200 dark:stroke-slate-700"
      />
      <line
        x1="14"
        y1="34"
        x2="58"
        y2="34"
        strokeWidth="0.5"
        className="stroke-slate-200 dark:stroke-slate-700"
      />
      <line
        x1="14"
        y1="42"
        x2="58"
        y2="42"
        strokeWidth="0.5"
        className="stroke-slate-200 dark:stroke-slate-700"
      />
      <line
        x1="14"
        y1="50"
        x2="58"
        y2="50"
        strokeWidth="0.5"
        className="stroke-slate-200 dark:stroke-slate-700"
      />
      <line
        x1="14"
        y1="58"
        x2="58"
        y2="58"
        strokeWidth="0.5"
        className="stroke-slate-200 dark:stroke-slate-700"
      />
      {/* Vertical lines */}
      <line
        x1="28"
        y1="14"
        x2="28"
        y2="66"
        strokeWidth="0.5"
        className="stroke-slate-200 dark:stroke-slate-700"
      />
      <line
        x1="44"
        y1="14"
        x2="44"
        y2="66"
        strokeWidth="0.5"
        className="stroke-slate-200 dark:stroke-slate-700"
      />
      {/* Cell content indicators */}
      <rect
        x="16"
        y="28"
        width="8"
        height="2"
        rx="1"
        className="fill-slate-300 dark:fill-slate-600"
      />
      <rect
        x="30"
        y="28"
        width="10"
        height="2"
        rx="1"
        className="fill-primary/60"
      />
      <rect
        x="46"
        y="28"
        width="6"
        height="2"
        rx="1"
        className="fill-slate-300 dark:fill-slate-600"
      />
      <rect
        x="16"
        y="36"
        width="10"
        height="2"
        rx="1"
        className="fill-slate-300 dark:fill-slate-600"
      />
      <rect
        x="30"
        y="36"
        width="8"
        height="2"
        rx="1"
        className="fill-primary/60"
      />
      <rect
        x="46"
        y="36"
        width="8"
        height="2"
        rx="1"
        className="fill-slate-300 dark:fill-slate-600"
      />
      <rect
        x="16"
        y="44"
        width="6"
        height="2"
        rx="1"
        className="fill-slate-300 dark:fill-slate-600"
      />
      <rect
        x="30"
        y="44"
        width="12"
        height="2"
        rx="1"
        className="fill-primary/60"
      />
      <rect
        x="46"
        y="44"
        width="4"
        height="2"
        rx="1"
        className="fill-slate-300 dark:fill-slate-600"
      />
      {/* Check mark */}
      <circle cx="62" cy="58" r="10" className="fill-success" />
      <path
        d="M57 58L60 61L67 54"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleKey: string;
  title?: string;
  onSuccess?: () => void;
  rute?: string;
}

export function ExcelImportDialog({
  open,
  onOpenChange,
  moduleKey,
  title = "Importar Excel",
  onSuccess,
  rute = "api/import",
}: ExcelImportDialogProps) {
  const [step, setStep] = useState<Step>("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreviewResult | null>(null);
  const [jobResult, setJobResult] = useState<JobStatusResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadingErrors, setDownloadingErrors] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep("upload");
    setLoading(false);
    setError(null);
    setPreview(null);
    setJobResult(null);
    setProgress(0);
    setSelectedFile(null);
    setIsDragging(false);
    setDownloadingErrors(false);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        reset();
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, reset],
  );

  const handleDownloadTemplate = async () => {
    try {
      setLoading(true);
      const base64 = await downloadTemplate(moduleKey);
      const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${moduleKey}-plantilla.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error descargando plantilla",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".xlsx")) {
      setError("Solo se aceptan archivos .xlsx");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo excede el limite de 10MB");
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileUpload = async () => {
    const file = selectedFile || fileRef.current?.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadPreview(moduleKey, formData, rute);
      setPreview(result);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error procesando archivo");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview || preview.validRows.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      const { jobId } = await confirmImport(moduleKey, preview.validRows);
      setStep("processing");
      setProgress(0);

      const poll = async () => {
        let attempts = 0;
        const maxAttempts = 120;
        while (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, 1000));
          const status = await pollJobStatus(jobId);

          if (status.status === "processing") {
            setProgress(status.progress || 0);
          }

          if (status.status === "completed") {
            setJobResult(status);
            setStep("completed");
            setProgress(100);
            onSuccess?.();
            return;
          }

          if (status.status === "failed") {
            setJobResult(status);
            setStep("failed");
            return;
          }

          attempts++;
        }

        setError("Tiempo de espera agotado");
        setStep("failed");
      };

      poll();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error confirmando importacion",
      );
      setStep("failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadErrors = async () => {
    if (!preview?.errorFileBase64) return;

    try {
      setDownloadingErrors(true);
      const byteArray = Uint8Array.from(atob(preview.errorFileBase64), (c) =>
        c.charCodeAt(0),
      );
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${moduleKey}-errores.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error descargando archivo de errores",
      );
    } finally {
      setDownloadingErrors(false);
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);
  const resolvedStepIndex =
    step === "completed" || step === "failed" ? STEPS.length : currentStepIndex;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden border-border/50">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-card">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Table2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-[13px]">
                  {step === "upload" &&
                    "Sube un archivo Excel (.xlsx) para importar datos."}
                  {step === "preview" && "Revisa los datos antes de confirmar."}
                  {step === "processing" && "Procesando la importacion..."}
                  {step === "completed" &&
                    "Importacion completada exitosamente."}
                  {step === "failed" &&
                    "Ocurrio un error durante la importacion."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Step indicator */}
          <div className="mt-5 flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === currentStepIndex;
              const isCompleted = i < resolvedStepIndex;
              const isFailed = step === "failed" && i === STEPS.length - 1;

              return (
                <div key={s.key} className="flex flex-1 items-center">
                  <div className="flex flex-1 flex-col items-center gap-2">
                    {/* Step circle */}
                    <div
                      className={`
                        relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all
                        ${
                          isCompleted
                            ? "border-success bg-success text-white"
                            : isActive
                              ? isFailed
                                ? "border-destructive bg-destructive/10 text-destructive"
                                : "border-primary bg-primary/10 text-primary"
                              : "border-muted-foreground/20 bg-muted/50 text-muted-foreground/50"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : isFailed ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    {/* Label */}
                    <span
                      className={`text-[11px] font-medium transition-colors ${
                        isCompleted
                          ? "text-success"
                          : isActive
                            ? isFailed
                              ? "text-destructive"
                              : "text-primary"
                            : "text-muted-foreground/60"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-full mx-1 rounded-full transition-colors ${
                        i < resolvedStepIndex
                          ? "bg-success"
                          : "bg-muted-foreground/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Content */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-destructive">{error}</span>
            </div>
          )}

          {/* Step: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileRef.current?.click()}
                className={`
                  group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-all
                  ${
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : selectedFile
                        ? "border-success/50 bg-success/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }
                `}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {selectedFile ? (
                  <>
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-success/10">
                      <FileSpreadsheet className="h-7 w-7 text-success" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedFile.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(0)} KB · Listo para
                      procesar
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      <span className="text-xs font-medium text-success">
                        Archivo seleccionado
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <SpreadsheetIllustration className="mb-2 h-20 w-20 transition-transform group-hover:scale-105" />
                    <p className="text-sm font-semibold text-foreground">
                      Arrastra tu archivo aqui
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      o haz clic para seleccionar
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground/60">
                      <span className="flex items-center gap-1">
                        <FileSpreadsheet className="h-3 w-3" />
                        Solo .xlsx
                      </span>
                      <span className="h-3 w-px bg-border" />
                      <span>Maximo 10MB</span>
                    </div>
                  </>
                )}
              </div>

              {/* Template download */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={loading}
                className="group flex w-full items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3 text-left text-sm transition-all hover:bg-muted/40 hover:border-border disabled:opacity-50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 transition-transform group-hover:scale-105">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Descargar plantilla</p>
                  <p className="text-xs text-muted-foreground">
                    Archivo .xlsx con el formato correcto
                  </p>
                </div>
                <div className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  .xlsx
                </div>
              </button>

              {/* Fields info accordion */}
              <ImportFieldsInfo moduleKey={moduleKey} rute={rute} />
            </div>
          )}

          {/* Step: Preview */}
          {step === "preview" && preview && (
            <div className="space-y-4">
              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {preview.totalRows}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Filas totales
                  </p>
                </div>
                <div className="rounded-lg border border-success/20 bg-success/5 p-3 text-center">
                  <p className="text-2xl font-bold text-success">
                    {preview.validCount}
                  </p>
                  <p className="text-[11px] text-success">Validas</p>
                </div>
                {preview.errorCount > 0 && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-center">
                    <p className="text-2xl font-bold text-destructive">
                      {preview.errorCount}
                    </p>
                    <p className="text-[11px] text-destructive/80">
                      Con errores
                    </p>
                  </div>
                )}
                {preview.errorCount === 0 && (
                  <div className="rounded-lg border border-success/20 bg-success/5 p-3 text-center flex flex-col items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-success mb-0.5" />
                    <p className="text-[11px] text-success">Sin errores</p>
                  </div>
                )}
              </div>

              {preview.validRows.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Vista previa
                    </p>
                  </div>
                  <ImportPreviewTable rows={preview.validRows} />
                </div>
              )}

              {preview.errors.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                      <p className="text-xs font-semibold uppercase tracking-wider text-destructive">
                        Errores ({preview.errors.length})
                      </p>
                    </div>
                    {preview.errorFileBase64 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadErrors}
                        disabled={downloadingErrors}
                        className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/5"
                      >
                        {downloadingErrors ? (
                          <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                        ) : (
                          <FileWarning className="mr-1.5 h-3 w-3" />
                        )}
                        Descargar errores
                      </Button>
                    )}
                  </div>
                  <ImportErrorTable errors={preview.errors} />
                </div>
              )}
            </div>
          )}

          {/* Step: Processing */}
          {step === "processing" && (
            <div className="flex flex-col items-center py-10">
              <div className="relative mb-5">
                <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-sm font-semibold">Procesando importacion</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {progress}% completado
              </p>
              <div className="mt-4 w-full max-w-xs">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Completed */}
          {step === "completed" && jobResult?.result && (
            <div className="flex flex-col items-center py-10">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <p className="text-base font-semibold">Importacion exitosa</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    {jobResult.result.created}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Creados</p>
                </div>
                {jobResult.result.failed > 0 && (
                  <>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-destructive">
                        {jobResult.result.failed}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Fallidos
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step: Failed */}
          {step === "failed" && (
            <div className="flex flex-col items-center py-10">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-base font-semibold">Error en la importacion</p>
              <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                {jobResult?.error || error || "Error desconocido"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 bg-muted/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {step === "preview" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Volver
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {step === "upload" && (
                <Button
                  size="sm"
                  onClick={handleFileUpload}
                  disabled={loading || !selectedFile}
                >
                  {loading && (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                  {!loading && <Upload className="mr-1.5 h-3.5 w-3.5" />}
                  Subir y previsualizar
                </Button>
              )}
              {step === "preview" && (
                <Button
                  size="sm"
                  onClick={handleConfirm}
                  disabled={loading || !preview || preview.validCount === 0}
                >
                  {loading && (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  )}
                  {!loading && <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
                  Confirmar {preview?.validCount || 0} filas
                </Button>
              )}
              {(step === "completed" || step === "failed") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleClose(false)}
                >
                  Cerrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
