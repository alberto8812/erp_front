import { NextAuthConfig } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak"
import Keycloak from "next-auth/providers/keycloak"
export default {
    providers: [
        Keycloak({
            clientId: process.env.KEYCLOAK_ID!,
            clientSecret: process.env.KEYCLOAK_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
        }),
    ],
} satisfies NextAuthConfig;