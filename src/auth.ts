import NextAuth from "next-auth"
import { jwtDecode } from "jwt-decode";
import authConfig from "@/auth.config";

async function refreshAccessToken(token: Record<string, unknown>) {
    try {
        const issuer = process.env.KEYCLOAK_ISSUER!;
        const tokenUrl = `${issuer}/protocol/openid-connect/token`;

        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                client_id: process.env.KEYCLOAK_ID!,
                client_secret: process.env.KEYCLOAK_SECRET!,
                refresh_token: token.refresh_token as string,
            }),
        });

        const refreshed = await response.json();

        if (!response.ok) {
            throw new Error(refreshed.error || "Failed to refresh token");
        }

        const decoded = jwtDecode<{
            realm_access?: { roles?: string[] };
            company_id?: string;
        }>(refreshed.access_token);

        return {
            ...token,
            accessToken: refreshed.access_token,
            id_token: refreshed.id_token,
            expires_at: Math.floor(Date.now() / 1000) + refreshed.expires_in,
            refresh_token: refreshed.refresh_token ?? token.refresh_token,
            decoded,
            company_id: decoded?.company_id,
            error: undefined,
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return { ...token, error: "RefreshTokenError" };
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request",
        newUser: '/'
    },
    events: {
        async signOut(message) {
            if ("token" in message && message.token?.id_token) {
                const issuer = process.env.KEYCLOAK_ISSUER!;
                const logoutUrl = `${issuer}/protocol/openid-connect/logout?id_token_hint=${message.token.id_token}`;
                try {
                    await fetch(logoutUrl);
                } catch (e) {
                    console.error("Failed to logout from Keycloak", e);
                }
            }
        },
    },
    callbacks: {
        async jwt({ token, account }) {
            const nowTimeStamp = Math.floor(Date.now() / 1000);

            // Login inicial — guardar tokens de Keycloak
            if (account) {
                const decoded = account.access_token ? jwtDecode<{
                    realm_access?: { roles?: string[] };
                    company_id?: string;
                }>(account.access_token) : null;
                token.decoded = decoded;
                token.accessToken = account.access_token;
                token.id_token = account.id_token;
                token.expires_at = account.expires_at;
                token.refresh_token = account.refresh_token;
                token.company_id = decoded?.company_id;
                return token;
            }

            // Token aun vigente — retornar sin cambios
            if (nowTimeStamp < (token.expires_at as number)) {
                return token;
            }

            // Token expirado — renovar con refresh_token
            console.log("Token expired, refreshing...");
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            // Si el refresh fallo, marcar la sesión con error
            if (token.error === "RefreshTokenError") {
                session.error = "RefreshTokenError";
                // Retornar sesión con error pero sin tokens válidos
                return session;
            }

            session.user.access_token = token.accessToken as string;
            session.user.id_token = token.id_token as string;
            session.access_token = token.accessToken as string;
            const decodedToken = token.decoded as { realm_access?: { roles?: string[] }; company_id?: string };
            session.roles = decodedToken?.realm_access?.roles || [];
            session.company_id = token.company_id as string;
            return session;
        },
    },
});
