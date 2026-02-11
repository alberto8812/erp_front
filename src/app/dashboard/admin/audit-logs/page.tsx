import { AuditLogsPage } from "./presentation/components/AuditLogsPage";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Registro de Auditoría
        </h1>
        <p className="text-sm text-muted-foreground">
          Consulta y monitorea todas las acciones realizadas en el sistema
        </p>
      </div>

      <AuditLogsPage companyId={session?.company_id} />
    </div>
  );
}
