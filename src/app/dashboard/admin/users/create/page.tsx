import { auth } from "@/auth";
import { getAllCompanies } from "@/action/company/get-all-companies.action";
import { CreateUserForm } from "./create-user-form";

export default async function CreateUserPage() {
  const session = await auth();
  const userRoles = session?.roles ?? [];
  const isSysAdmin = userRoles.includes("sysAdmin");

  let companies: Awaited<ReturnType<typeof getAllCompanies>> = [];

  // Only fetch companies if user is sysAdmin (can assign to any company)
  // CEO and hrManager create users in their own company (injected from JWT)
  if (isSysAdmin) {
    try {
      companies = await getAllCompanies();
    } catch {
      // If companies fail to load, the form will show an empty select
    }
  }

  return <CreateUserForm companies={companies} isSysAdmin={isSysAdmin} />;
}
