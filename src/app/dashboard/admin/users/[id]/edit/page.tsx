import { notFound } from "next/navigation";
import { adminGetUser } from "@/action/user/admin-get-user.action";
import { EditUserForm } from "./edit-user-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;

  let user;
  try {
    user = await adminGetUser(id);
  } catch {
    notFound();
  }

  return <EditUserForm user={user} />;
}
