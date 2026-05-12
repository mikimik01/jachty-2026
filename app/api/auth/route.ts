import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// ─── Rate limiting ───
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

const attempts = new Map<string, { count: number; firstAttempt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record) return { limited: false, retryAfterSec: 0 };
  if (now - record.firstAttempt > WINDOW_MS) {
    attempts.delete(ip);
    return { limited: false, retryAfterSec: 0 };
  }
  if (record.count >= MAX_ATTEMPTS) {
    return { limited: true, retryAfterSec: Math.ceil((WINDOW_MS - (now - record.firstAttempt)) / 1000) };
  }
  return { limited: false, retryAfterSec: 0 };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count++;
  }
}

// ─── Helpers ───

async function hashToken(secret: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Route ───

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { limited, retryAfterSec } = isRateLimited(ip);
  if (limited) {
    return NextResponse.json(
      { error: `Za dużo prób. Spróbuj za ${Math.ceil(retryAfterSec / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }

  const { password } = await request.json();
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword || password !== sitePassword) {
    recordFailedAttempt(ip);
    const record = attempts.get(ip);
    const remaining = MAX_ATTEMPTS - (record?.count ?? 0);
    return NextResponse.json(
      { error: remaining > 0 ? `Złe hasło. Pozostało prób: ${remaining}` : `Za dużo prób. Spróbuj za 15 min.` },
      { status: remaining > 0 ? 401 : 429 }
    );
  }

  attempts.delete(ip);

  const token = await hashToken(sitePassword, "__jachty2026_site__");

  const cookieStore = await cookies();
  cookieStore.set("site_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return NextResponse.json({ ok: true });
}
