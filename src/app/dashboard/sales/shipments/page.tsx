import { ShipmentsTablePage } from "./presentation/components/ShipmentsTablePage";

export default function ShipmentsPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Despachos</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona los despachos y entregas de órdenes de venta
        </p>
      </div>

      <ShipmentsTablePage />
    </div>
  );
}
