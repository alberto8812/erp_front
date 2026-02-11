import { ThirdPartiesTablePage } from "./presentation/components/ThirdPartiesTablePage";

export default function ThirdPartyPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Terceros</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de terceros para la organización, asignación de clientes y
          optimización de rutas
        </p>
      </div>
      <ThirdPartiesTablePage />
    </div>
  );
}
