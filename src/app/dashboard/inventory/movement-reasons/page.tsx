import { MovementReasonsTablePage } from "./presentation/components/MovementReasonsTablePage";

export default function MovementReasonsPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Razones de Movimiento</h1>
        <p className="text-sm text-muted-foreground">
          Configuración de razones para ajustes y movimientos de inventario
        </p>
      </div>
      <MovementReasonsTablePage />
    </div>
  );
}
