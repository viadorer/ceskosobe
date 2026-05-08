import { NextRequest } from "next/server";
import { getPropertyBySlug } from "@/lib/nemovizor";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return Response.json(
        { error: "Parametr 'slug' je povinný." },
        { status: 400 },
      );
    }

    const property = await getPropertyBySlug(slug);
    return Response.json(property);
  } catch (err) {
    console.error("[nemovizor/detail] Error:", err);
    return Response.json(
      { error: "Nepodařilo se načíst detail nemovitosti." },
      { status: 500 },
    );
  }
}
