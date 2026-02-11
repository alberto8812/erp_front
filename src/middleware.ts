import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;

    // Public routes — always allow
    if (
        pathname === "/" ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/auth/")
    ) {
        return NextResponse.next();
    }

    // Not authenticated or refresh token failed — redirect to logout to clear cookies
    if (!session || (session as unknown as { error?: string }).error === "RefreshTokenError") {
        const url = req.nextUrl.clone();
        // Si hay error de refresh token, ir a logout para limpiar cookies
        if ((session as unknown as { error?: string })?.error === "RefreshTokenError") {
            url.pathname = "/auth/logout";
        } else {
            url.pathname = "/";
        }
        return NextResponse.redirect(url);
    }

    const roles = (session as any).roles as string[] | undefined;
    const isSysAdmin = roles?.includes("sysAdmin") ?? false;
    const isHrManager = roles?.includes("hrManager") ?? false;
    const isCeo = roles?.includes("ceo") ?? false;
    const canManageUsers = isSysAdmin || isHrManager || isCeo;

    // Admin user routes — sysAdmin, hrManager, ceo can manage users
    if (pathname.startsWith("/dashboard/admin/users")) {
        if (!canManageUsers) {
            const url = req.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // Admin system routes (preferences, audit-logs) — sysAdmin and ceo
    if (
        pathname.startsWith("/dashboard/admin/preferences") ||
        pathname.startsWith("/dashboard/admin/audit-logs")
    ) {
        if (!isSysAdmin && !isCeo) {
            const url = req.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // Other admin routes — only sysAdmin
    if (pathname.startsWith("/dashboard/admin")) {
        if (!isSysAdmin) {
            const url = req.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // Dashboard routes (non-admin) — authenticated users
    if (pathname.startsWith("/dashboard")) {
        return NextResponse.next();
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
