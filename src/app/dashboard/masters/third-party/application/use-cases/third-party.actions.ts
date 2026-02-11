"use server";

import { apiClient } from "@/lib/api";
import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { ThirdParty, GroupCreateThirdPartyPayload } from "../../domain/entities/third-party.entity";

const BASE_PATH = "/onerp/third-parties";
const actions = createPaginatedActions<ThirdParty>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const update = actions.update;
export const remove = actions.remove;

export async function create(data: Partial<ThirdParty>): Promise<ThirdParty> {
  const payload: GroupCreateThirdPartyPayload = {
    third_party: {
      company_id: (data as Record<string, string>).company_id ?? "",
      type: data.type ?? "customer",
      tax_id: (data as Record<string, string>).tax_id ?? "",
      verification_dv: (data as Record<string, string>).verification_dv ?? undefined,
      legal_name: (data as Record<string, string>).legal_name ?? "",
      comercial_name: data.comercial_name ?? undefined,
      email: data.email ?? undefined,
      phone: data.phone ?? undefined,
      mobili: data.mobili ?? undefined,
      website: data.website ?? undefined,
      status: data.status ?? "active",
      tax_regime: data.tax_regime ?? "",
      credit_limit: data.credit_limit ?? undefined,
      balance: data.balance ?? 0,
    },
    third_party_address: {
      label: (data as Record<string, string>).address_label ?? "billing",
      country: (data as Record<string, string>).address_country_id ?? undefined,
      state: (data as Record<string, string>).address_state_id ?? undefined,
      city: (data as Record<string, string>).address_city_id ?? undefined,
      postal_code: (data as Record<string, string>).address_postal_code ?? undefined,
      street_line1: (data as Record<string, string>).address_street_line1 ?? undefined,
      street_line2: (data as Record<string, string>).address_street_line2 ?? undefined,
      is_default_billing: true,
      is_default_shipping: true,
    },
    third_party_contact: {
      full_name: (data as Record<string, string>).contact_full_name ?? "",
      role: (data as Record<string, string>).contact_role ?? undefined,
      email: (data as Record<string, string>).contact_email ?? undefined,
      phone: (data as Record<string, string>).contact_phone ?? undefined,
      mobile: (data as Record<string, string>).contact_mobile ?? undefined,
      is_primary: true,
    },
    third_party_bank_account: {
      bank_name: (data as Record<string, string>).bank_name ?? "",
      account_type: (data as Record<string, string>).bank_account_type ?? "checking",
      account_number: (data as Record<string, string>).bank_account_number ?? "",
      currency: (data as Record<string, string>).bank_currency ?? undefined,
      is_primary: true,
    },
    payment_term_id: (data as Record<string, string>).payment_term_id ?? undefined,
  };

  return apiClient<ThirdParty>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
