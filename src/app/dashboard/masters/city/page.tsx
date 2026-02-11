import { CitiesTablePage } from "./presentation/components/CitiesTablePage";

export default function CitiesPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ciudades</h1>
        <p className="text-sm text-muted-foreground">Gestión de ciudades</p>
      </div>
      <CitiesTablePage />
    </div>
  );
}
