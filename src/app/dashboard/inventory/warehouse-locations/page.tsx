import { WarehouseLocationsTablePage } from "./presentation/components/WarehouseLocationsTablePage";

export default function WarehouseLocationsPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ubicaciones</h1>
        <p className="text-sm text-muted-foreground">
          Zonas, pasillos, racks y bins dentro de los almacenes
        </p>
      </div>
      <WarehouseLocationsTablePage />
    </div>
  );
}
