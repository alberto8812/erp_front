import { CurrenciesTablePage } from "./presentation/components/CurrenciesTablePage";

export default function CurrencyPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Monedas</h1>
        <p className="text-sm text-muted-foreground">Gestión de monedas</p>
      </div>
      <CurrenciesTablePage />
    </div>
  );
}
