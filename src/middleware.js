import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // Routes that can be accessed while signed out
          publicRoutes: [
          "/",
          "/home",
          "/sign-in",
          "/sign-up",
          "/api/webhooks/clerk",
          "/products",
          "/vendors",
          "/about",
          "/contact",
          "/test-auth",
          "/test-signup",
          "/debug-clerk",
        ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/webhooks/clerk",
  ],
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 