"use server";

import { apiClient } from "@/lib/api";

export interface Company {
  company_Id: string;
  name: string;
  legal_name: string;
  tax_id: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  currency: string;
  timezone: string;
  tenant_status: string;
  created_at: string;
}

export async function getAllCompanies(): Promise<Company[]> {
  return apiClient<Company[]>("/onerp/company");
}
