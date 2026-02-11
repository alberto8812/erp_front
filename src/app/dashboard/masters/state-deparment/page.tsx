import { StateDepartmentsTablePage } from "./presentation/components/StateDepartmentsTablePage";

export default function StateDepartmentsPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Departamentos</h1>
        <p className="text-sm text-muted-foreground">Gestión de departamentos</p>
      </div>
      <StateDepartmentsTablePage />
    </div>
  );
}
