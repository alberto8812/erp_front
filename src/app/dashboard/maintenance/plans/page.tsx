"use client";

import { PlansTablePage } from "./presentation/components/PlansTablePage";

export default function MaintenancePlansPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Planes de Mantenimiento Preventivo
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure y gestione los planes de mantenimiento preventivo para sus
          activos
        </p>
      </div>
      <PlansTablePage />
    </div>
  );
}
