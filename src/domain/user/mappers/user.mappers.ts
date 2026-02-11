import { IUserEntityInfrastructure } from "@/infrastruture/user/user.entity.infrastructure";
import { IUserEntityDomain } from "../entity/user.entity.domain";

export const mapUserEntityDomain = (user: IUserEntityInfrastructure): IUserEntityDomain => ({
    user_Id: user.user_Id,
    keycloakId: user.keycloakId,
    username: user.username,
    email: user.email,
    password_hass: user.password_hass,
    first_name: user.first_name,
    last_name: user.last_name,
    const_center_id: user.const_center_id,
    roles: user.roles,
    status: user.status,
    last_login_at: user.last_login_at,
    created_at: user.created_at,
    updated_at: user.updated_at,
    phone: user.phone,
    address: user.address,
    tax_id: user.tax_id,
    language: user.language,
    timezone: user.timezone,
    metadata: user.metadata,
    company_Id: user.company_Id,
});