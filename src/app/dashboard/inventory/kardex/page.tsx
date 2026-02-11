import { KardexTablePage } from "./presentation/components/KardexTablePage";

export default function KardexPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kardex</h1>
        <p className="text-sm text-muted-foreground">
          Registro histórico de movimientos de inventario
        </p>
      </div>
      <KardexTablePage />
    </div>
  );
}
