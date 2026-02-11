"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import type { FormConfig } from "../../types/form-config.types";
import { DynamicFormBuilder } from "./DynamicFormBuilder";

interface CrudFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  formConfig: FormConfig;
  defaultValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
}

export function CrudFormDialog({
  open,
  onOpenChange,
  title,
  description,
  formConfig,
  defaultValues,
  onSubmit,
  isLoading,
}: CrudFormDialogProps) {
  const hasSections = !!formConfig.sections?.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          hasSections
            ? "gap-0 p-0 overflow-hidden sm:max-w-2xl"
            : "gap-0 p-0 overflow-hidden sm:max-w-lg"
        }
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Divider */}
        <div className="border-t" />

        {/* Form body */}
        <ScrollArea className="max-h-[calc(100vh-220px)]">
          <DynamicFormBuilder
            config={formConfig}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" size="sm" form="crud-form" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
