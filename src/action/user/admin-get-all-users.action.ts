"use server";

import { apiClient } from "@/lib/api";

export interface AdminUser {
  user_Id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string;
  status: string;
  company_Id: string;
  company_name?: string;
  created_at: string;
}

export async function adminGetAllUsers(): Promise<AdminUser[]> {
  return apiClient<AdminUser[]>("/onerp/user");
}
