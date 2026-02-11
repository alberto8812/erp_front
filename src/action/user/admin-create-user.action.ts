"use server";

import { apiClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  roles: string;
  company_Id?: string; // Optional - injected by backend for hrManager
}

export async function adminCreateUser(
  data: CreateUserInput,
): Promise<{ success: true; data: unknown } | { success: false; error: string }> {
  try {
    const result = await apiClient("/onerp/user", {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear el usuario",
    };
  }
}
