import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// ─── Rate limiting ───
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

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

  // Reset window if expired
  if (now - record.firstAttempt > WINDOW_MS) {
    attempts.delete(ip);
    return { limited: false, retryAfterSec: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - record.firstAttempt)) / 1000);
    return { limited: true, retryAfterSec };
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

function clearAttempts(ip: string) {
  attempts.delete(ip);
}

// ─── Routes ───

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Check rate limit
  const { limited, retryAfterSec } = isRateLimited(ip);
  if (limited) {
    return NextResponse.json(
      { error: `Za dużo prób. Spróbuj za ${Math.ceil(retryAfterSec / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }

  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    recordFailedAttempt(ip);
    const record = attempts.get(ip);
    const remaining = MAX_ATTEMPTS - (record?.count ?? 0);
    return NextResponse.json(
      { error: remaining > 0 ? `Złe hasło. Pozostało prób: ${remaining}` : `Za dużo prób. Spróbuj za 15 min.` },
      { status: remaining > 0 ? 401 : 429 }
    );
  }

  // Success – clear rate limit
  clearAttempts(ip);

  // Create a simple signed token (hash of password + secret)
  const encoder = new TextEncoder();
  const data = encoder.encode(adminPassword + "__jachty2026_salt__");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const token = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return NextResponse.json({ ok: true });
}
