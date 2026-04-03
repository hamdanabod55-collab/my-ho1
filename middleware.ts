import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL('/', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname
        if (path.startsWith("/watch")) {
          return !!token;
        }
        if (path.startsWith("/admin")) {
          return !!token;
        }
        return true;
      }
    }
  }
)

export const config = { matcher: ["/admin/:path*", "/watch/:path*"] }
