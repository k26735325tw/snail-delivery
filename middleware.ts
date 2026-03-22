import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/api/cms"];

function shouldProtect(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  if (!shouldProtect(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const password = process.env.CMS_ADMIN_PASSWORD?.trim();

  if (!password) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Snail Delivery CMS"',
      },
    });
  }

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separator = decoded.indexOf(":");
    const providedPassword = separator === -1 ? "" : decoded.slice(separator + 1);

    if (providedPassword === password) {
      return NextResponse.next();
    }
  } catch {
    return new NextResponse("Authentication failed", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Snail Delivery CMS"',
      },
    });
  }

  return new NextResponse("Authentication failed", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Snail Delivery CMS"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/cms/:path*"],
};

