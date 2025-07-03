import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isAuthenticatedRoute = createRouteMatcher([
  "/messages(.*)",
  "/favorites(.*)",
  "/my-orders(.*)",
  "/order-request(.*)"
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // Admin routes - require admin role
  if (isAdminRoute(req)) {
    // Redirect to sign-in if not authenticated
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    // Check for admin role in multiple locations
    const publicMetadata = sessionClaims?.metadata || sessionClaims?.publicMetadata || {}
    const privateMetadata = sessionClaims?.privateMetadata || {}
    const unsafeMetadata = sessionClaims?.unsafeMetadata || {}

    // Check all possible metadata locations for role
    const role = publicMetadata.role || privateMetadata.role || unsafeMetadata.role || sessionClaims?.role

    console.log("Admin route middleware check:", {
      userId,
      publicMetadata: sessionClaims?.publicMetadata,
      privateMetadata: sessionClaims?.privateMetadata,
      metadata: sessionClaims?.metadata,
      role: role,
      url: req.url,
    })

    // Allow access if user has admin role
    if (role === "admin") {
      return NextResponse.next()
    }

    // If no admin role found, check database as fallback
    try {
      const { prisma } = await import("@/lib/prisma")
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true },
      })

      if (user?.role === "admin") {
        console.log("Admin access granted via database check")
        return NextResponse.next()
      }
    } catch (error) {
      console.error("Database check failed:", error)
    }

    // Redirect to unauthorized page for admin routes
    console.log("Access denied - redirecting to unauthorized")
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  // Authenticated routes - require login only
  if (isAuthenticatedRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
    return NextResponse.next()
  }

  // Allow access to public routes
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
