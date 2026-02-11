import { CountriesTablePage } from "./presentation/components/CountriesTablePage";

export default function CountryPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Países</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de países para la organización, asignación de clientes y
          optimización de rutas
        </p>
      </div>
      <CountriesTablePage />
    </div>
  );
}
