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
import { usePreferenceDefinitions, useResolvedPreferences } from "../hooks/use-preferences";
import { PreferenceCategorySection } from "./PreferenceCategorySection";
import { PreferenceValueEditor } from "./PreferenceValueEditor";
import type { PreferenceDefinition } from "../../domain/entities/preference-definition.entity";

interface PreferencesPageProps {
  companyId?: string;
  userId?: string;
}

export function PreferencesPage({ companyId, userId }: PreferencesPageProps) {
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPreference, setEditingPreference] = useState<PreferenceDefinition | null>(null);

  const {
    data: definitions,
    isLoading: isLoadingDefinitions,
    error: definitionsError,
  } = usePreferenceDefinitions({
    module: selectedModule === "all" ? undefined : selectedModule,
  });

  const {
    data: resolvedPreferences,
    isLoading: isLoadingResolved,
  } = useResolvedPreferences({
    company_Id: companyId,
    user_Id: userId,
  });

  const filteredDefinitions = useMemo(() => {
    if (!definitions) return [];

    return definitions.filter((def) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        def.name.toLowerCase().includes(query) ||
        def.code.toLowerCase().includes(query) ||
        def.description?.toLowerCase().includes(query)
      );
    });
  }, [definitions, searchQuery]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, PreferenceDefinition[]> = {};

    filteredDefinitions.forEach((def) => {
      const category = def.category || "general";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(def);
    });

    return groups;
  }, [filteredDefinitions]);

  const modules = useMemo(() => {
    if (!definitions) return [];
    const uniqueModules = [...new Set(definitions.map((d) => d.module))];
    return uniqueModules.sort();
  }, [definitions]);

  const isLoading = isLoadingDefinitions || isLoadingResolved;

  if (definitionsError) {
    return (
      <div className="flex items-start gap-2 rounded-md bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          {definitionsError instanceof Error
            ? definitionsError.message
            : "Error al cargar las preferencias"}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
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

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar preferencias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedByCategory).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium">No se encontraron preferencias</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            Object.entries(groupedByCategory).map(([category, preferences]) => (
              <PreferenceCategorySection
                key={category}
                category={category}
                preferences={preferences}
                resolvedPreferences={resolvedPreferences}
                onEdit={setEditingPreference}
              />
            ))
          )}
        </div>
      )}

      <PreferenceValueEditor
        definition={editingPreference}
        open={!!editingPreference}
        onOpenChange={(open) => !open && setEditingPreference(null)}
        companyId={companyId}
        userId={userId}
      />
    </div>
  );
}
