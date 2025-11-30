import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAuthPage = ["/login", "/signup"].includes(req.nextUrl.pathname);
    const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
    const isHomePage = req.nextUrl.pathname === "/";

    // Allow access to auth pages and home page
    if (isAuthPage || isHomePage) {
        return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect admin to admin dashboard if trying to access subscriber dashboard
    if (isDashboardRoute && role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Redirect non-admin to subscriber dashboard if trying to access admin routes
    if (isAdminRoute && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/services/:path*"],
};
