import { NextResponse, MiddlewareConfig } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const requestPath = request.nextUrl.pathname

  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
    if (requestPath.startsWith("/maintenance")) return NextResponse.next()

    if (requestPath.startsWith("/api")) {
      return NextResponse.json(
        JSON.stringify({
          success: false,
          errors: [
            {
              code: "IsInMaintenance",
              message: "メンテナンス中です",
            },
          ],
        }),
        { status: 503 },
      )
    }

    if (
      requestPath.startsWith("/public/login") ||
      requestPath.startsWith("/public/signup")
    ) {
      return NextResponse.redirect(new URL("/maintenance", request.url))
    }

    if (requestPath.startsWith("/public")) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  if (requestPath.startsWith("/maintenance")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: ["/public/:path*", "/api/:path*", "/v1/:path*", "/maintenance"],
}
