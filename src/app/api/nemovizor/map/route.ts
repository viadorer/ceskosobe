import { NextRequest, NextResponse } from "next/server";
import { getMapPoints, type SearchParams } from "@/lib/nemovizor";

// ---------------------------------------------------------------------------
// GET /api/nemovizor/map
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const params: SearchParams & {
      sw_lat?: number;
      sw_lon?: number;
      ne_lat?: number;
      ne_lon?: number;
      zoom?: number;
    } = {};

    const listingType = searchParams.get("listing_type");
    if (listingType) params.listing_type = listingType;

    const category = searchParams.get("category");
    if (category) params.category = category.split(",");

    const city = searchParams.get("city");
    if (city) params.city = city;

    const priceMin = searchParams.get("price_min");
    if (priceMin) params.price_min = Number(priceMin);

    const priceMax = searchParams.get("price_max");
    if (priceMax) params.price_max = Number(priceMax);

    const areaMin = searchParams.get("area_min");
    if (areaMin) params.area_min = Number(areaMin);

    const areaMax = searchParams.get("area_max");
    if (areaMax) params.area_max = Number(areaMax);

    // Bounding box params
    const swLat = searchParams.get("sw_lat");
    if (swLat) params.sw_lat = Number(swLat);

    const swLon = searchParams.get("sw_lon");
    if (swLon) params.sw_lon = Number(swLon);

    const neLat = searchParams.get("ne_lat");
    if (neLat) params.ne_lat = Number(neLat);

    const neLon = searchParams.get("ne_lon");
    if (neLon) params.ne_lon = Number(neLon);

    const zoom = searchParams.get("zoom");
    if (zoom) params.zoom = Number(zoom);

    const result = await getMapPoints(params);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[nemovizor/map] Error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
