import { DocumentTypesTablePage } from "./presentation/components/DocumentTypesTablePage";

export default function DocumentTypePage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tipos de Documento</h1>
        <p className="text-sm text-muted-foreground">Gestión de tipos de documento</p>
      </div>
      <DocumentTypesTablePage />
    </div>
  );
}
