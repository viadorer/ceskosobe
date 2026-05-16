import { NextRequest, NextResponse } from "next/server";
import { getFilterOptions, type SearchParams } from "@/lib/nemovizor";

// ---------------------------------------------------------------------------
// GET /api/nemovizor/filters
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const params: Partial<SearchParams> = {};

    const listingType = searchParams.get("listing_type");
    if (listingType) params.listing_type = listingType;

    const category = searchParams.get("category");
    if (category) params.category = category.split(",");

    const city = searchParams.get("city");
    if (city) params.city = city;

    const result = await getFilterOptions(params);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[nemovizor/filters] Error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
