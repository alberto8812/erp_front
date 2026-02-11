"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import type { PreferenceDefinition } from "../../domain/entities/preference-definition.entity";
import type { ResolvedPreference } from "../../domain/entities/preference-value.entity";
import { useState } from "react";

interface PreferenceCardProps {
  definition: PreferenceDefinition;
  resolved?: ResolvedPreference;
  onEdit: (definition: PreferenceDefinition) => void;
  onChange?: (value: unknown) => void;
  disabled?: boolean;
}

export function PreferenceCard({
  definition,
  resolved,
  onEdit,
  onChange,
  disabled = false,
}: PreferenceCardProps) {
  const [localValue, setLocalValue] = useState<unknown>(
    resolved?.value ?? definition.default_value
  );

  const effectiveValue = resolved?.value ?? definition.default_value;

  const handleChange = (value: unknown) => {
    setLocalValue(value);
    onChange?.(value);
  };

  const renderInput = () => {
    switch (definition.value_type) {
      case "boolean":
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={effectiveValue === true || effectiveValue === "true"}
              onCheckedChange={handleChange}
              disabled={disabled}
            />
            <span className="text-sm text-muted-foreground">
              {effectiveValue === true || effectiveValue === "true" ? "Habilitado" : "Deshabilitado"}
            </span>
          </div>
        );

      case "integer":
      case "decimal":
        return (
          <Input
            type="number"
            value={effectiveValue?.toString() ?? ""}
            onChange={(e) => handleChange(definition.value_type === "integer"
              ? parseInt(e.target.value)
              : parseFloat(e.target.value))}
            disabled={disabled}
            className="max-w-[200px]"
          />
        );

      case "string":
        if (definition.allowed_values && definition.allowed_values.length > 0) {
          return (
            <Select
              value={effectiveValue?.toString()}
              onValueChange={handleChange}
              disabled={disabled}
            >
              <SelectTrigger className="max-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {definition.allowed_values.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        return (
          <Input
            value={effectiveValue?.toString() ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="max-w-[300px]"
          />
        );

      case "json":
        return (
          <Input
            value={typeof effectiveValue === "string" ? effectiveValue : JSON.stringify(effectiveValue)}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder='{"key": "value"}'
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{definition.name}</h4>
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
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {definition.code}
          </p>
          {definition.description && (
            <p className="text-sm text-muted-foreground">
              {definition.description}
            </p>
          )}

          <div className="pt-2">{renderInput()}</div>

          {resolved && (
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-muted-foreground">
              <span>Sistema: {resolved.system_value ?? "—"}</span>
              <span>•</span>
              <span>Empresa: {resolved.company_value ?? "—"}</span>
              <span>•</span>
              <span>Usuario: {resolved.user_value ?? "—"}</span>
              {resolved.branch_value && (
                <>
                  <span>•</span>
                  <span>Sucursal: {resolved.branch_value}</span>
                </>
              )}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(definition)}
          disabled={disabled}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
