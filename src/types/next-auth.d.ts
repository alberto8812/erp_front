import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            access_token?: string;
            id_token?: string;
        };
        roles?: string[];
        company_id?: string;
        access_token?: string;
        error?: string;
    }

    interface JWT {
        decoded?: DecodedToken;
        access_token?: string;
        accessToken?: string;
        id_token?: string;
        expires_at?: number;
        refresh_token?: string;
        company_id?: string;
    }
}

interface DecodedToken {
    realm_access?: {
        roles: string[];
    };
    company_id?: string;
    [key: string]: any;
}
