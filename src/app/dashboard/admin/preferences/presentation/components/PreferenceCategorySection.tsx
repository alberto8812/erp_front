"use client";

import type { PreferenceDefinition } from "../../domain/entities/preference-definition.entity";
import type { ResolvedPreference } from "../../domain/entities/preference-value.entity";
import { PreferenceCard } from "./PreferenceCard";

interface PreferenceCategorySectionProps {
  category: string;
  preferences: PreferenceDefinition[];
  resolvedPreferences?: Record<string, ResolvedPreference>;
  onEdit: (definition: PreferenceDefinition) => void;
}

const categoryIcons: Record<string, string> = {
  inventory: "📦",
  sales: "💰",
  purchasing: "🛒",
  finance: "💵",
  system: "⚙️",
  hr: "👥",
  manufacturing: "🏭",
};

export function PreferenceCategorySection({
  category,
  preferences,
  resolvedPreferences,
  onEdit,
}: PreferenceCategorySectionProps) {
  if (preferences.length === 0) return null;

  const icon = categoryIcons[category.toLowerCase()] || "📋";

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span>{icon}</span>
        <span className="uppercase">{category}</span>
      </h3>
      <div className="space-y-3">
        {preferences.map((preference) => (
          <PreferenceCard
            key={preference.code}
            definition={preference}
            resolved={resolvedPreferences?.[preference.code]}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
