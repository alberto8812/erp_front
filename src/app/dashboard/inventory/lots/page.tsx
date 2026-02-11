import { LotsTablePage } from "./presentation/components/LotsTablePage";

export default function LotsPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Lotes</h1>
        <p className="text-sm text-muted-foreground">
          Trazabilidad por lotes y números de serie
        </p>
      </div>
      <LotsTablePage />
    </div>
  );
}
