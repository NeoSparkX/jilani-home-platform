import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const user = req.auth?.user;

    // Extract both phone number and role from the JWT
    const hasPhoneNumber = !!user?.phoneNumber;
    const role = user?.role as "admin" | "owner" | "user" | undefined;

    const path = req.nextUrl.pathname;
    const isOnboardingPage = path === "/onboarding";
    const isAuthPage = path === "/login" || path === "/signup";

    // Group your protected routes
    const isDashboardRoute = path.startsWith("/admin") || path.startsWith("/owner") || path.startsWith("/user");

    // 1. Not logged in -> Protect Dashboards & Onboarding, but let them see public pages (like /properties)
    if (!isLoggedIn) {
        if (isDashboardRoute || isOnboardingPage) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
        return NextResponse.next(); // Allow access to public homepage and listings
    }

    // --- FROM HERE DOWN, THE USER IS LOGGED IN ---

    // Define their correct default dashboard based on their role
    const defaultDashboard = role === "admin" ? "/admin"
        : role === "owner" ? "/owner"
            : "/user";

    // 2. Keep logged-in users away from Auth Pages
    if (isAuthPage) {
        return NextResponse.redirect(new URL(defaultDashboard, req.nextUrl));
    }

    // 3. 🚨 THE ONBOARDING SHIELDS
    // Shield A: If they DON'T have a phone number, force them to onboarding (keep them out of dashboards)
    if (!hasPhoneNumber && !isOnboardingPage) {
        return NextResponse.redirect(new URL("/onboarding", req.nextUrl));
    }
    // Shield B: If they DO have a phone number, keep them away from onboarding
    if (hasPhoneNumber && isOnboardingPage) {
        return NextResponse.redirect(new URL(defaultDashboard, req.nextUrl));
    }

    // 4. 🛡️ THE RBAC SHIELDS (Role-Based Access Control)
    // Protect Admin routes
    if (path.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL(defaultDashboard, req.nextUrl));
    }

    // Protect Owner routes (Allow admins to see owner routes for support purposes)
    if (path.startsWith("/owner") && role !== "owner" && role !== "admin") {
        return NextResponse.redirect(new URL(defaultDashboard, req.nextUrl));
    }

    // Optional: Keep Admins out of standard user dashboards to avoid confusion
    if (path.startsWith("/user") && role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    // The matcher runs on every route EXCEPT api, static files, and images
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};