import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/api/webhook/clerk",
    "/products",
    "/categories",
    "/search",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ],
  
  // Routes that can be accessed while signed out, but also show user info if signed in
  ignoredRoutes: [
    "/api/webhook/clerk",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
