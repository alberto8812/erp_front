import { PriceListsTablePage } from "./presentation/components/PriceListsTablePage";

export default function PriceListsPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Listas de Precios
        </h1>
        <p className="text-sm text-muted-foreground">
          Configura listas de precios para diferentes clientes y segmentos
        </p>
      </div>

      <PriceListsTablePage />
    </div>
  );
}
