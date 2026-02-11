import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface ThirdParty extends BaseEntity {
  third_party_id: string;
  company_id: string;
  type: string;
  tax_id: string;
  verification_dv: string | null;
  legal_name: string;
  comercial_name: string | null;
  email: string | null;
  phone: string | null;
  mobili: string | null;
  website: string | null;
  status: string;
  tax_regime: string;
  fiscal_responsabilities: unknown;
  economic_activities: unknown;
  payment_term_id: string | null;
  credit_limit: number | null;
  balance: number | null;
  days_past_due: number | null;
  is_deleted: boolean;
  metadata: unknown;
}

export interface GroupCreateThirdPartyPayload {
  third_party: {
    company_id: string;
    type: string;
    tax_id: string;
    verification_dv?: string;
    legal_name: string;
    comercial_name?: string;
    email?: string;
    phone?: string;
    mobili?: string;
    website?: string;
    status?: string;
    tax_regime: string;
    credit_limit?: number;
    balance?: number;
  };
  third_party_address: {
    label: string;
    country?: string;
    state?: string;
    city?: string;
    postal_code?: string;
    street_line1?: string;
    street_line2?: string;
    is_default_billing: boolean;
    is_default_shipping: boolean;
    latitude?: number;
    longitude?: number;
  };
  third_party_contact: {
    full_name: string;
    role?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    is_primary: boolean;
  };
  third_party_bank_account: {
    bank_name: string;
    account_type: string;
    account_number: string;
    currency?: string;
    is_primary: boolean;
  };
  payment_term_id?: string;
}
