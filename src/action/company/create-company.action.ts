"use server";

import { apiClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

export interface CreateCompanyInput {
  name: string;
  legal_name: string;
  tax_id: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  currency: string;
  timezone: string;
}

export async function createCompany(
  data: CreateCompanyInput,
): Promise<{ success: true; data: unknown } | { success: false; error: string }> {
  try {
    const result = await apiClient("/onerp/company", {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidatePath("/dashboard/admin/companies");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear la compañía",
    };
  }
}
