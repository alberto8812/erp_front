"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, XCircle } from "lucide-react";
import { useFeatureFlags, useCompanyFlags, useSetCompanyFlag } from "../hooks/use-feature-flags";
import { FeatureFlagCard } from "./FeatureFlagCard";
import { toast } from "@/components/ui/use-toast";

interface FeatureFlagsPageProps {
  companyId?: string;
}

export function FeatureFlagsPage({ companyId }: FeatureFlagsPageProps) {
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: flags,
    isLoading: isLoadingFlags,
    error: flagsError,
  } = useFeatureFlags();

  const {
    data: companyFlags,
    isLoading: isLoadingCompanyFlags,
  } = useCompanyFlags(companyId);

  const setCompanyFlag = useSetCompanyFlag();

  const modules = useMemo(() => {
    if (!flags) return [];
    const uniqueModules = [...new Set(flags.map((f) => f.module))];
    return uniqueModules.sort();
  }, [flags]);

  const filteredFlags = useMemo(() => {
    if (!flags) return [];

    return flags.filter((flag) => {
      if (selectedModule !== "all" && flag.module !== selectedModule) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !flag.name.toLowerCase().includes(query) &&
          !flag.code.toLowerCase().includes(query) &&
          !flag.description?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (statusFilter !== "all") {
        const isEnabled = companyFlags?.[flag.code] ?? flag.default_enabled;
        if (statusFilter === "enabled" && !isEnabled) return false;
        if (statusFilter === "disabled" && isEnabled) return false;
      }

      return true;
    });
  }, [flags, selectedModule, searchQuery, statusFilter, companyFlags]);

  const handleToggle = async (code: string, enabled: boolean) => {
    try {
      await setCompanyFlag.mutateAsync({
        code,
        enabled,
        company_Id: companyId,
      });

      toast({
        title: "Feature flag actualizado",
        description: `El feature flag ha sido ${enabled ? "habilitado" : "deshabilitado"} correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el feature flag",
        variant: "destructive",
      });
    }
  };

  const isLoading = isLoadingFlags || isLoadingCompanyFlags;

  if (flagsError) {
    return (
      <div className="flex items-start gap-2 rounded-md bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          {flagsError instanceof Error
            ? flagsError.message
            : "Error al cargar los feature flags"}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Módulo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los módulos</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="enabled">Habilitados</SelectItem>
            <SelectItem value="disabled">Deshabilitados</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar feature flags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFlags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium">No se encontraron feature flags</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            filteredFlags.map((flag) => (
              <FeatureFlagCard
                key={flag.feature_flag_Id}
                flag={flag}
                isEnabled={companyFlags?.[flag.code]}
                onToggle={(enabled) => handleToggle(flag.code, enabled)}
                disabled={setCompanyFlag.isPending}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
