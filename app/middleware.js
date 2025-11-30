import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAuthPage = ["/login", "/signup"].includes(req.nextUrl.pathname);

    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isAdminRoute && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard", "/services/:path*"],
};