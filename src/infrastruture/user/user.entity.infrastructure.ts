export interface IUserEntityInfrastructure {
    user_Id: string;
    keycloakId?: string;
    username: string;
    email: string;
    password_hass: string;
    first_name: string;
    last_name: string;
    const_center_id: string;
    roles: string;
    status: string;
    last_login_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    phone: string;
    address: string;
    tax_id: string;
    language: string;
    timezone: string;
    metadata: string;
    company_Id: string;
}
