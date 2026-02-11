import { PurchaseOrdersTablePage } from "./presentation/components/PurchaseOrdersTablePage";

export default function PurchaseOrdersPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Órdenes de Compra
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las órdenes de compra, desde borradores hasta recepción
        </p>
      </div>

      <PurchaseOrdersTablePage />
    </div>
  );
}
