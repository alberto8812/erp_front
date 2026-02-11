import { FeatureFlagsPage } from "./presentation/components/FeatureFlagsPage";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Feature Flags
        </h1>
        <p className="text-sm text-muted-foreground">
          Administra las funcionalidades habilitadas del sistema
        </p>
      </div>

      <FeatureFlagsPage companyId={session?.company_id} />
    </div>
  );
}
