"use server";

import { apiClient } from "@/lib/api";

export interface AdminUserDetail {
  user_Id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string;
  status: string;
  company_Id: string;
  company_name?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export async function adminGetUser(userId: string): Promise<AdminUserDetail> {
  return apiClient<AdminUserDetail>(`/onerp/user/${userId}`);
}
