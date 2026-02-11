import { InventoryCountsTablePage } from "./presentation/components/InventoryCountsTablePage";

export default function InventoryCountsPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Conteos de Inventario</h1>
        <p className="text-sm text-muted-foreground">
          Conteos cíclicos e inventarios físicos
        </p>
      </div>
      <InventoryCountsTablePage />
    </div>
  );
}
