import { StockLevelsTablePage } from "./presentation/components/StockLevelsTablePage";

export default function StockLevelsPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Niveles de Stock</h1>
        <p className="text-sm text-muted-foreground">
          Existencias actuales por producto, almacén y ubicación
        </p>
      </div>
      <StockLevelsTablePage />
    </div>
  );
}
