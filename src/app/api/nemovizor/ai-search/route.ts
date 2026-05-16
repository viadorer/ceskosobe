import { NextRequest, NextResponse } from "next/server";
import { aiSearch } from "@/lib/nemovizor";

// ---------------------------------------------------------------------------
// POST /api/nemovizor/ai-search
// Accepts { query: string } and returns structured filters + search results.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      typeof (body as Record<string, unknown>).query !== "string" ||
      !(body as Record<string, unknown>).query
    ) {
      return NextResponse.json(
        { error: "Parametr 'query' je povinný." },
        { status: 400 },
      );
    }

    const { query } = body as { query: string };
    const result = await aiSearch(query);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[nemovizor/ai-search] Error:", err);
    const message =
      err instanceof Error ? err.message : "Došlo k chybě při AI vyhledávání.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
