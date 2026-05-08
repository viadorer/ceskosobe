import { NextRequest } from "next/server";
import { searchProperties } from "@/lib/nemovizor";
import type { SearchParams } from "@/lib/nemovizor";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const params: SearchParams = {};

    const listing_type = url.searchParams.get("listing_type");
    if (listing_type) params.listing_type = listing_type;

    const category = url.searchParams.get("category");
    if (category) params.category = category.split(",");

    const subtype = url.searchParams.get("subtype");
    if (subtype) params.subtype = subtype.split(",");

    const city = url.searchParams.get("city");
    if (city) params.city = city;

    const country = url.searchParams.get("country");
    if (country) params.country = country.split(",");

    const price_min = url.searchParams.get("price_min");
    if (price_min) params.price_min = Number(price_min);

    const price_max = url.searchParams.get("price_max");
    if (price_max) params.price_max = Number(price_max);

    const area_min = url.searchParams.get("area_min");
    if (area_min) params.area_min = Number(area_min);

    const area_max = url.searchParams.get("area_max");
    if (area_max) params.area_max = Number(area_max);

    const sort = url.searchParams.get("sort");
    if (sort) params.sort = sort;

    const page = url.searchParams.get("page");
    if (page) params.page = Number(page);

    const limit = url.searchParams.get("limit");
    if (limit) params.limit = Number(limit);

    const result = await searchProperties(params);
    return Response.json(result);
  } catch (err) {
    console.error("[nemovizor/search] Error:", err);
    return Response.json(
      { error: "Nepodařilo se načíst nemovitosti." },
      { status: 500 },
    );
  }
}
