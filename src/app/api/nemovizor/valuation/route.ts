import { NextRequest, NextResponse } from "next/server";
import { createValuation } from "@/lib/nemovizor";

// ---------------------------------------------------------------------------
// POST /api/nemovizor/valuation
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Neplatny pozadavek." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    /* Required fields */
    if (
      typeof data.category !== "string" ||
      !data.category ||
      typeof data.city !== "string" ||
      !data.city ||
      typeof data.area !== "number" ||
      data.area <= 0 ||
      typeof data.email !== "string" ||
      !data.email
    ) {
      return NextResponse.json(
        {
          error:
            "Vyplnte prosim vsechna povinna pole (typ, mesto, plocha, e-mail).",
        },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Zadejte prosim platnou e-mailovou adresu." },
        { status: 400 },
      );
    }

    const result = await createValuation({
      category: data.category,
      city: data.city,
      area: data.area,
      email: data.email,
      street: typeof data.street === "string" ? data.street : undefined,
      zip: typeof data.zip === "string" ? data.zip : undefined,
      rooms_label:
        typeof data.rooms_label === "string" ? data.rooms_label : undefined,
      condition:
        typeof data.condition === "string" ? data.condition : undefined,
      year_built:
        typeof data.year_built === "number" ? data.year_built : undefined,
      name: typeof data.name === "string" ? data.name : undefined,
      phone: typeof data.phone === "string" ? data.phone : undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[nemovizor/valuation] Error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Doslo k chybe. Zkuste to prosim pozdeji.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
