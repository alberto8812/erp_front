"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { PreferenceDefinition } from "../../domain/entities/preference-definition.entity";
import type { PreferenceScope } from "../../domain/entities/preference-value.entity";
import { useSetPreferenceValue } from "../hooks/use-preferences";
import { toast } from "@/components/ui/use-toast";

interface PreferenceValueEditorProps {
  definition: PreferenceDefinition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: string;
  userId?: string;
}

export function PreferenceValueEditor({
  definition,
  open,
  onOpenChange,
  companyId,
  userId,
}: PreferenceValueEditorProps) {
  const [scope, setScope] = useState<PreferenceScope>("company");
  const [value, setValue] = useState<unknown>("");
  const setPreferenceValue = useSetPreferenceValue();

  if (!definition) return null;

  const handleSave = async () => {
    try {
      await setPreferenceValue.mutateAsync({
        code: definition.code,
        value,
        scope,
        company_Id: scope === "company" || scope === "branch" ? companyId : undefined,
        user_Id: scope === "user" ? userId : undefined,
      });

      toast({
        title: "Preferencia actualizada",
        description: `${definition.name} ha sido actualizada correctamente`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar la preferencia",
        variant: "destructive",
      });
    }
  };

  const renderValueInput = () => {
    switch (definition.value_type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === true || value === "true"}
              onCheckedChange={setValue}
            />
            <Label>
              {value === true || value === "true" ? "Habilitado" : "Deshabilitado"}
            </Label>
          </div>
        );

      case "integer":
      case "decimal":
        return (
          <Input
            type="number"
            value={value?.toString() ?? ""}
            onChange={(e) =>
              setValue(
                definition.value_type === "integer"
                  ? parseInt(e.target.value)
                  : parseFloat(e.target.value)
              )
            }
            placeholder={definition.default_value?.toString()}
          />
        );

      case "string":
        if (definition.allowed_values && definition.allowed_values.length > 0) {
          return (
            <Select value={value?.toString()} onValueChange={setValue}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar valor" />
              </SelectTrigger>
              <SelectContent>
                {definition.allowed_values.map((allowedValue) => (
                  <SelectItem key={allowedValue} value={allowedValue}>
                    {allowedValue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        return (
          <Input
            value={value?.toString() ?? ""}
            onChange={(e) => setValue(e.target.value)}
            placeholder={definition.default_value?.toString()}
          />
        );

      case "json":
        return (
          <Input
            value={typeof value === "string" ? value : JSON.stringify(value)}
            onChange={(e) => setValue(e.target.value)}
            placeholder='{"key": "value"}'
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Preferencia</DialogTitle>
          <DialogDescription>
            Modificar el valor de {definition.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Código</Label>
            <p className="text-sm font-mono text-muted-foreground">
              {definition.code}
            </p>
          </div>

          {definition.description && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Descripción</Label>
              <p className="text-sm text-muted-foreground">
                {definition.description}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {definition.is_required && (
              <Badge variant="destructive" className="text-xs">
                Requerido
              </Badge>
            )}
            {definition.is_system && (
              <Badge variant="secondary" className="text-xs">
                Sistema
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Tipo: {definition.value_type}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scope">Ámbito</Label>
            <Select value={scope} onValueChange={(v) => setScope(v as PreferenceScope)}>
              <SelectTrigger id="scope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">Empresa</SelectItem>
                <SelectItem value="branch">Sucursal</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Valor</Label>
            {renderValueInput()}
            {definition.default_value && (
              <p className="text-xs text-muted-foreground">
                Valor por defecto: {definition.default_value.toString()}
              </p>
            )}
          </div>

          {definition.validation_rules && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs font-medium mb-1">Reglas de validación:</p>
              <pre className="text-xs text-muted-foreground">
                {JSON.stringify(definition.validation_rules, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={setPreferenceValue.isPending}>
            {setPreferenceValue.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
