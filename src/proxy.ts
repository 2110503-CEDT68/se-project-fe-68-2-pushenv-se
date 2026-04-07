import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const rolePrefixes = [
  { prefix: "/events", role: "user" },
  { prefix: "/profile", role: "user" },
  { prefix: "/dashboard", role: "company" },
  { prefix: "/company", role: "company" },
  { prefix: "/admin", role: "admin" },
] as const;

function readTokenPayload(token: string) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded));
    return decoded as { role?: string };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("job-fair-token")?.value;
  const pathname = request.nextUrl.pathname;

  if (!token) {
    const needsAuth = rolePrefixes.some(({ prefix }) => pathname.startsWith(prefix));
    if (needsAuth) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  const payload = readTokenPayload(token);

  if (pathname === "/login" || pathname === "/register") {
    if (payload?.role === "user") return NextResponse.redirect(new URL("/events", request.url));
    if (payload?.role === "company") return NextResponse.redirect(new URL("/dashboard", request.url));
    if (payload?.role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  const matched = rolePrefixes.find(({ prefix }) => pathname.startsWith(prefix));

  if (matched && payload?.role !== matched.role) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
