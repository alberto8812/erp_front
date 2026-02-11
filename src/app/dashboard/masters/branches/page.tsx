import { BranchesTablePage } from "./presentation/components/BranchesTablePage";

export default function BranchPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sucursales</h1>
        <p className="text-sm text-muted-foreground">Gestión de sucursales</p>
      </div>
      <BranchesTablePage />
    </div>
  );
}
