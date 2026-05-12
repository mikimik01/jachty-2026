import { NextRequest, NextResponse } from "next/server";

async function hashToken(secret: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Routes that don't require site auth
const PUBLIC_PATHS = ["/login", "/api/auth", "/api/admin-auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths & static assets
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ─── Site-wide auth ───
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword) {
    const siteToken = request.cookies.get("site_token")?.value;
    const expectedSiteToken = await hashToken(sitePassword, "__jachty2026_site__");

    if (siteToken !== expectedSiteToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ─── Admin auth (extra layer) ───
  if (pathname === "/admin") {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const adminToken = request.cookies.get("admin_token")?.value;
    const expectedAdminToken = await hashToken(adminPassword, "__jachty2026_salt__");

    if (adminToken !== expectedAdminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
