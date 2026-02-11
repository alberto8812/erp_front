import { PreferencesPage } from "./presentation/components/PreferencesPage";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Configuración del Sistema
        </h1>
        <p className="text-sm text-muted-foreground">
          Administra las preferencias y configuraciones del sistema
        </p>
      </div>

      <PreferencesPage
        companyId={session?.company_id}
        userId={session?.user?.id}
      />
    </div>
  );
}
