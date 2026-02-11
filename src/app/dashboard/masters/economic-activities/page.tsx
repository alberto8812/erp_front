import { EconomicActivitiesTablePage } from "./presentation/components/EconomicActivitiesTablePage";

export default function EconomicActivityPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Actividades Económicas</h1>
        <p className="text-sm text-muted-foreground">Gestión de actividades económicas</p>
      </div>
      <EconomicActivitiesTablePage />
    </div>
  );
}
