"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import type { FeatureFlag } from "../../domain/entities/feature-flag.entity";

interface FeatureFlagCardProps {
  flag: FeatureFlag;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  disabled?: boolean;
}

const moduleColors: Record<string, string> = {
  system: "bg-slate-100 text-slate-800",
  inventory: "bg-blue-100 text-blue-800",
  sales: "bg-green-100 text-green-800",
  purchasing: "bg-purple-100 text-purple-800",
  finance: "bg-yellow-100 text-yellow-800",
  manufacturing: "bg-orange-100 text-orange-800",
  hr: "bg-pink-100 text-pink-800",
};

export function FeatureFlagCard({
  flag,
  isEnabled,
  onToggle,
  disabled = false,
}: FeatureFlagCardProps) {
  const enabled = isEnabled ?? flag.default_enabled;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-red-500'}`} />
            <h4 className="font-medium">{flag.name}</h4>
            <Badge
              variant="outline"
              className={moduleColors[flag.module] || "bg-gray-100 text-gray-800"}
            >
              {flag.module}
            </Badge>
            {flag.is_system && (
              <Badge variant="secondary" className="text-xs">
                Sistema
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            {flag.code}
          </p>

          {flag.description && (
            <p className="text-sm text-muted-foreground">
              {flag.description}
            </p>
          )}

          {flag.rollout_percentage > 0 && flag.rollout_percentage < 100 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Rollout</span>
                <span>{flag.rollout_percentage}%</span>
              </div>
              <Progress value={flag.rollout_percentage} className="h-2" />
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Default: {flag.default_enabled ? "Habilitado" : "Deshabilitado"}</span>
            <span>•</span>
            <span>Rollout: {flag.rollout_percentage}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            disabled={disabled || flag.is_system}
          />
          <span className="text-sm font-medium">
            {enabled ? "Habilitado" : "Deshabilitado"}
          </span>
        </div>
      </div>
    </Card>
  );
}
