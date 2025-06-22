import { clerkMiddleware } from "@clerk/nextjs/server"

/**
 * Always run Clerk middleware so that any call to `auth()` (e.g. in /app/page.tsx)
 * has access to the session.  Static assets and Next.js internals are excluded.
 */
export default clerkMiddleware()

/**
 * The matcher below:
 *  • `/((?!_next/|.*\\..*).*)`  → matches every path that does NOT start with `_next/`
 *    and does NOT contain a file-extension (e.g. `.png`, `.css`).
 *  • `'/'`                      → explicitly matches the root path.
 *
 * Together they ensure pages like `/`, `/dashboard`, API routes, etc. all trigger middleware.
 */
export const config = {
  matcher: ["/((?!_next/|.*\\..*).*)", "/"],
}
