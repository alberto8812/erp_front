"use server";

import { apiClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  roles?: string;
  status?: string;
}

export async function adminUpdateUser(
  userId: string,
  data: UpdateUserInput
): Promise<{ success: true; data: unknown } | { success: false; error: string }> {
  try {
    const result = await apiClient(`/onerp/user/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath(`/dashboard/admin/users/${userId}/edit`);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar el usuario",
    };
  }
}
