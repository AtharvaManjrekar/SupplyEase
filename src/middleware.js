import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define a single middleware function that combines Clerk and custom logic
export default clerkMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/home",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/api/webhooks/clerk",
    "/products",
    "/vendors",
    "/about",
    "/contact",
    "/test-auth",
    "/test-signup",
    "/debug-clerk",
    "/test-password",
  ],

  ignoredRoutes: [
    "/api/webhooks/clerk",
  ],

  async afterAuth(auth, req, evt) {
    // Handle rate limiting
    if (auth.status === 429) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Handle authentication errors with more detailed messages
    if (auth.status === 401) {
      const errorMessage = auth.reason || "Authentication failed";
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    // Handle invalid tokens or expired sessions
    if (auth.status === 403) {
      return NextResponse.json(
        { error: "Session expired or invalid. Please sign in again." },
        { status: 403 }
      );
    }

    // Get the current path
    const path = req.nextUrl.pathname;

    // Define routes that should redirect to dashboard when user is authenticated
    const publicOnlyRoutes = ['/', '/home'];
    const isAuthPage = path === "/sign-in" || 
                      path === "/sign-up" || 
                      path === "/forgot-password";

    // If user is authenticated and trying to access public/auth pages
    if (auth.userId && (isAuthPage || publicOnlyRoutes.includes(path))) {
      // Check if the user exists in MongoDB before redirecting
      try {
        const response = await fetch(`${req.nextUrl.origin}/api/users/${auth.userId}`);
        if (!response.ok) {
          // If user doesn't exist in MongoDB, redirect to sign-in
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
        const user = await response.json();
        
        // Validate user role
        if (!['vendor', 'distributor', 'admin'].includes(user.role)) {
          // Invalid role, redirect to sign-in
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }

        // User exists and has valid role, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch (error) {
        console.error("Error validating user in middleware:", error);
        // On error, redirect to sign-in for safety
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }

    // For protected routes (not in publicRoutes), check MongoDB user record
    if (auth.userId && !req.nextUrl.pathname.startsWith('/api/') && !publicOnlyRoutes.includes(path) && !isAuthPage) {
      try {
        const response = await fetch(`${req.nextUrl.origin}/api/users/${auth.userId}`);
        if (!response.ok) {
          // User not found in MongoDB
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
        const user = await response.json();
        
        // Validate user role
        if (!['vendor', 'distributor', 'admin'].includes(user.role)) {
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
      } catch (error) {
        console.error("Error validating user in middleware:", error);
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }

    // Allow the request to proceed
    return NextResponse.next();
  },
});

// Single config export with comprehensive matcher
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", 
    "/", 
    "/api/(.*)",
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password"
  ],
};