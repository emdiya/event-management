import { type NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("session_token")?.value

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!sessionToken && !request.nextUrl.pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
