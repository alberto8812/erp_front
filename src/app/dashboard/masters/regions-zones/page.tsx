import { RegionsZonesTablePage } from "./presentation/components/RegionsZonesTablePage";

export default function RegionZonePage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Regiones y Zonas
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestión de regiones y zonas para la organización, asignación de
          clientes y optimización de rutas
        </p>
      </div>
      <RegionsZonesTablePage />
    </div>
  );
}
