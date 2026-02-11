import { PageSideTitle } from "@/components/pagetabComponent/PageSideTitle";

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <PageSideTitle
        title="Mantenimiento"
        subtitle="Gestión de activos, órdenes de trabajo y planes de mantenimiento"
      >
        {children}
      </PageSideTitle>
    </div>
  );
}
