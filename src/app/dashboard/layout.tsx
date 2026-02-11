import type React from "react";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import Providers from "../providres";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const roles = session?.roles ?? [];
  const userName = session?.user?.name ?? "Usuario";
  const userEmail = session?.user?.email ?? "";

  return (
    <DashboardShell roles={roles} userName={userName} userEmail={userEmail}>
      <Providers>{children}</Providers>
    </DashboardShell>
  );
}
