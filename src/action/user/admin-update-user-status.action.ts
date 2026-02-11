"use server";

import { apiClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

export type UserStatus = "active" | "inactive" | "blocked" | "suspended";

export interface UpdateUserStatusInput {
  status: UserStatus;
}

export async function adminUpdateUserStatus(
  userId: string,
  status: UserStatus
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await apiClient(`/onerp/user/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar el estado",
    };
  }
}
