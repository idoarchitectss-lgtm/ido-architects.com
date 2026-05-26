import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Production domain — set NEXT_PUBLIC_APP_URL in environment variables
const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "https://idoarchitects.com";

// ============================================
// ROUTE CONFIGURATION
// ============================================

/**
 * Auth routes - redirect to dashboard if already logged in
 */
const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
];

/**
 * Public API endpoints - accessible without authentication (GET only)
 */
const publicApiEntities = [
    "/api/seed",       // Product data
    "/api/content",    // CMS content
    "/api/health",     // Health checks
];

/**
 * Protected API endpoints requiring authentication
 */
const protectedApiPatterns = [
    "/api/me",         // User profile
    "/api/wishlist",   // User wishlist
];

/**
 * Admin-only API endpoints
 */
const adminApiPatterns = [
    "/api/admin",      // Admin operations
    "/api/cron",       // Cron jobs (should also check secret)
];

/**
 * Admin-only page routes
 */
const adminRoutes = [
    "/dashboard/admin",
    "/admin",
];

// ============================================
// PROXY FUNCTION
// ============================================

/**
 * Next.js 16 Proxy (formerly middleware)
 * Handles request routing, authentication, access control, and CORS policy
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // ============================================
    // CORS PREFLIGHT HANDLER (OPTIONS requests)
    // ============================================
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 204 });
        
        // Determine CORS policy based on route
        if (publicApiEntities.some(api => pathname === api || pathname.startsWith(api + "/"))) {
            // Public APIs - Allow all origins
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        } else if (
            protectedApiPatterns.some(p => pathname.startsWith(p)) ||
            adminApiPatterns.some(p => pathname.startsWith(p))
        ) {
            // Protected/Admin APIs - Restrict to APP_ORIGIN only
            response.headers.set('Access-Control-Allow-Origin', APP_ORIGIN);
            response.headers.set('Access-Control-Allow-Credentials', 'true');
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }
        
        response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
        return response;
    }
    
    // ============================================
    // 1. PUBLIC API ENDPOINTS (GET only)
    // ============================================
    if (
        request.method === "GET" && 
        publicApiEntities.some((api) => pathname === api || pathname.startsWith(api + "/"))
    ) {
        const response = NextResponse.next();
        // Public APIs - Allow all origins (CORS = *)
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        return response;
    }

    // ============================================
    // 2. PROTECTED API ENDPOINTS
    // ============================================
    if (protectedApiPatterns.some((pattern) => pathname.startsWith(pattern))) {
        const session = await auth();
        
        if (!session?.user) {
            const errorResponse = NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
            errorResponse.headers.set('Access-Control-Allow-Origin', APP_ORIGIN);
            errorResponse.headers.set('Access-Control-Allow-Credentials', 'true');
            return errorResponse;
        }
        
        // Success - Add restricted CORS headers
        const response = NextResponse.next();
        response.headers.set('Access-Control-Allow-Origin', APP_ORIGIN);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    }

    // ============================================
    // 2.5. CRON ENDPOINTS (allow with valid Bearer token)
    // ============================================
    if (pathname.startsWith("/api/cron")) {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        // If valid CRON_SECRET provided, allow immediately
        if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
            return NextResponse.next();
        }
        
        // Otherwise, fall through to admin API check
        // (allows manual execution by admins via browser)
    }

    // ============================================
    // 3. ADMIN API ENDPOINTS
    // ============================================
    if (adminApiPatterns.some((pattern) => pathname.startsWith(pattern))) {
        const session = await auth();
        
        if (!session?.user) {
            const errorResponse = NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
            errorResponse.headers.set('Access-Control-Allow-Origin', APP_ORIGIN);
            errorResponse.headers.set('Access-Control-Allow-Credentials', 'true');
            return errorResponse;
        }

        // Check admin role
        if (session.user.role !== 'ADMIN') {
            const errorResponse = NextResponse.json(
                { success: false, message: "Admin access required" },
                { status: 403 }
            );
            errorResponse.headers.set('Access-Control-Allow-Origin', APP_ORIGIN);
            errorResponse.headers.set('Access-Control-Allow-Credentials', 'true');
            return errorResponse;
        }
        
        // Success - Add restricted CORS headers
        const response = NextResponse.next();
        response.headers.set('Access-Control-Allow-Origin', APP_ORIGIN);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    }

    // ============================================
    // 4. ADMIN PAGE ROUTES
    // ============================================
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
        const session = await auth();
        
        if (!session?.user) {
            const url = request.nextUrl.clone();
            url.pathname = "/auth/login";
            url.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(url);
        }

        if (session.user.role !== 'ADMIN') {
            // Redirect non-admin users to home
            return NextResponse.redirect(new URL("/", request.url));
        }
        
        return NextResponse.next();
    }

    // ============================================
    // 5. AUTH ROUTES (redirect if logged in)
    // ============================================
    if (authRoutes.includes(pathname)) {
        const session = await auth();
        
        if (session?.user) {
            // Redirect to dashboard if already logged in
            const redirectUrl = session.user.role === 'ADMIN' 
                ? "/dashboard/admin"
                : "/dashboard";
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        
        return NextResponse.next();
    }

    // ============================================
    // 6. DASHBOARD ROUTES (require authentication)
    // ============================================
    if (pathname.startsWith("/dashboard")) {
        const session = await auth();
        
        if (!session?.user) {
            const url = request.nextUrl.clone();
            url.pathname = "/auth/login";
            url.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(url);
        }

        // Redirect ADMIN landing on bare /dashboard → /dashboard/admin
        if (session.user.role === 'ADMIN' && pathname === '/dashboard') {
            return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        }
        
        return NextResponse.next();
    }

    // ============================================
    // 7. DEFAULT - Allow all other routes (public pages)
    // ============================================
    // All pages are public by default unless explicitly protected above
    // This includes: /, /contact, /faq, /seeds/*, /partners/*, etc.
    return NextResponse.next();
}

/**
 * Configure middleware to only run on specific paths
 * Exclude static files and assets to improve performance
 */
export const config = {
  matcher: [
    // Catch all routes except static files
    "/((?!_next/static|_next/image|favicon.ico|public|assets|.*\\..*).*)",
    // Explicitly include API routes
    "/api/:path*",
    // Explicitly include dashboard routes
    "/dashboard/:path*",
    "/admin/:path*"
  ],
};