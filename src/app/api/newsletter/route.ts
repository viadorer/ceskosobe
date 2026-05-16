import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_URL =
  "https://api-production-88cf.up.railway.app/api/v1/public/forms/newsletter-prih-40669/submit";

// ---------------------------------------------------------------------------
// In-memory rate limiter: 5 requests per minute per IP
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const ipTimestamps = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipTimestamps.get(ip) ?? [];

  // Keep only timestamps within the current window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    ipTimestamps.set(ip, recent);
    return true;
  }

  recent.push(now);
  ipTimestamps.set(ip, recent);
  return false;
}

// ---------------------------------------------------------------------------
// POST /api/newsletter
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      !("email" in body) ||
      typeof (body as Record<string, unknown>).email !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid 'email' field." },
        { status: 400 },
      );
    }

    const { email } = body as { email: string };

    const upstream = await fetch(UPSTREAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: {}, email }),
    });

    const data: unknown = await upstream.json().catch(() => null);

    return NextResponse.json(data ?? {}, { status: upstream.status });
  } catch (err) {
    console.error("[newsletter] Error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
