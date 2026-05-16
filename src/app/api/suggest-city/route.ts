import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// GET /api/suggest-city?q=Pra&limit=7
// Proxies Mapy.cz Suggest API — keeps API key server-side.
// Falls back to a simple pass-through if no key is configured.
// ---------------------------------------------------------------------------

const MAPY_API_KEY = process.env.MAPYCZ_API_KEY || "";
const MAPY_BASE = "https://api.mapy.cz/v1";

export interface CitySuggestion {
  name: string;
  label: string;
  latitude?: number;
  longitude?: number;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  if (!MAPY_API_KEY) {
    // No key configured — return empty so the client can fall back
    return NextResponse.json([]);
  }

  try {
    const params = new URLSearchParams({
      query: q,
      lang: "cs",
      limit: request.nextUrl.searchParams.get("limit") || "7",
      type: "regional.municipality",
      apikey: MAPY_API_KEY,
    });

    const res = await fetch(`${MAPY_BASE}/suggest?${params.toString()}`, {
      next: { revalidate: 86400 }, // cache 24h — city names don't change
    });

    if (!res.ok) {
      console.error(`[suggest-city] Mapy.cz API ${res.status}`);
      return NextResponse.json([]);
    }

    const data = (await res.json()) as {
      items?: {
        name: string;
        label: string;
        position?: { lon: number; lat: number };
      }[];
    };

    const suggestions: CitySuggestion[] = (data.items ?? []).map((item) => ({
      name: item.name,
      label: item.label,
      latitude: item.position?.lat,
      longitude: item.position?.lon,
    }));

    return NextResponse.json(suggestions);
  } catch (err) {
    console.error("[suggest-city] Error:", err);
    return NextResponse.json([]);
  }
}
