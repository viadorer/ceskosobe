// ---------------------------------------------------------------------------
// Nemovizor API client — server-side only
// ---------------------------------------------------------------------------
// Base URL includes /api/v1 so paths below are relative to that.
// The HTTP API returns camelCase fields everywhere.  We normalise to
// snake_case in our TypeScript types so that client components have a
// single, consistent contract.
// ---------------------------------------------------------------------------

const NEMOVIZOR_BASE =
  process.env.NEMOVIZOR_API_BASE || "https://nemovizor.vercel.app/api/v1";

const NEMOVIZOR_KEY = process.env.NEMOVIZOR_API_KEY || "";

// ---------------------------------------------------------------------------
// Types — aligned with real API responses (snake_case)
// ---------------------------------------------------------------------------

export interface NemovizorProperty {
  id: string;
  slug: string;
  title: string;
  listing_type: "sale" | "rent" | "auction" | "shares" | "project";
  category: "apartment" | "house" | "land" | "commercial" | "other";
  subtype?: string | null;
  rooms_label?: string | null;
  price: number;
  price_note?: string | null;
  price_currency: string;
  price_unit?: string | null;
  city?: string | null;
  district?: string | null;
  street?: string | null;
  zip?: string | null;
  region?: string | null;
  city_part?: string | null;
  location_label?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  area?: number | null;
  land_area?: number | null;
  summary?: string | null;
  description?: string | null;
  condition?: string | null;
  energy_rating?: string | null;
  floor?: number | null;
  total_floors?: number | null;
  year_built?: number | null;
  balcony?: boolean;
  terrace?: boolean;
  garden?: boolean;
  elevator?: boolean;
  cellar?: boolean;
  garage?: boolean;
  pool?: boolean;
  parking?: string | null;
  image_src?: string | null;
  image_alt?: string | null;
  images: string[];
  broker_id?: string | null;
  brokers?: NemovizorBrokerSummary[] | null;
  featured?: boolean;
  active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  source?: string | null;
}

export interface NemovizorBrokerSummary {
  id: string;
  name: string;
  photo?: string | null;
}

export interface BrokerContact {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  photo?: string | null;
}

export interface SearchParams {
  listing_type?: string;
  category?: string[];
  subtype?: string[];
  city?: string;
  country?: string[];
  price_min?: number;
  price_max?: number;
  area_min?: number;
  area_max?: number;
  sort?: string;
  page?: number;
  limit?: number;
  agency_id?: string;
  broker_id?: string;
}

export interface SearchResult {
  data: NemovizorProperty[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  next_cursor?: string | null;
}

export interface MapPoint {
  id: string;
  slug: string;
  latitude: number;
  longitude: number;
  price?: number | null;
  price_currency?: string | null;
  title?: string | null;
  category?: string | null;
  listing_type?: string | null;
  image_src?: string | null;
}

export interface FilterOptions {
  categories: { value: string; count: number }[];
  subtypes: { value: string; count: number }[];
  cities: { value: string; count: number }[];
  listingTypes: { value: string; count: number }[];
  countries: { value: string; count: number }[];
  currencies: { value: string; count: number }[];
  priceRange: { min: number; max: number };
  areaRange: { min: number; max: number };
}

export interface ValuationResult {
  id: string;
  estimate_low: number;
  estimate_mid: number;
  estimate_high: number;
  currency: string;
  status?: string;
}

export interface AiSearchResult {
  filters: Partial<SearchParams>;
  results: SearchResult;
}

// ---------------------------------------------------------------------------
// camelCase → snake_case normaliser for all API responses
// ---------------------------------------------------------------------------

const CAMEL_TO_SNAKE_MAP: Record<string, string> = {
  nextCursor: "next_cursor",
  listingType: "listing_type",
  roomsLabel: "rooms_label",
  priceNote: "price_note",
  priceCurrency: "price_currency",
  priceUnit: "price_unit",
  priceNegotiation: "price_negotiation",
  cityPart: "city_part",
  locationLabel: "location_label",
  landArea: "land_area",
  builtUpArea: "built_up_area",
  floorArea: "floor_area",
  balconyArea: "balcony_area",
  cellarArea: "cellar_area",
  gardenArea: "garden_area",
  loggiaArea: "loggia_area",
  terraceArea: "terrace_area",
  energyRating: "energy_rating",
  buildingMaterial: "building_material",
  heatingSource: "heating_source",
  totalFloors: "total_floors",
  parkingSpaces: "parking_spaces",
  garageCount: "garage_count",
  yearBuilt: "year_built",
  lastRenovation: "last_renovation",
  imageSrc: "image_src",
  imageAlt: "image_alt",
  brokerId: "broker_id",
  createdAt: "created_at",
  updatedAt: "updated_at",
  projectId: "project_id",
  externalId: "external_id",
  externalSource: "external_source",
  featuredUntil: "featured_until",
  topPosition: "top_position",
  topUntil: "top_until",
  isPremium: "is_premium",
  agencyId: "agency_id",
  embeddingUpdatedAt: "embedding_updated_at",
};

function normalisePropertyKeys(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    const snakeKey = CAMEL_TO_SNAKE_MAP[key] ?? key;
    out[snakeKey] = value;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Core fetch helper
// ---------------------------------------------------------------------------

async function nemovizorFetch<T = unknown>(
  path: string,
  options?: RequestInit & { revalidate?: number },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (NEMOVIZOR_KEY) {
    headers["x-api-key"] = NEMOVIZOR_KEY;
  }

  const { revalidate, ...fetchOptions } = options ?? {};

  const res = await fetch(`${NEMOVIZOR_BASE}${path}`, {
    ...fetchOptions,
    headers: { ...headers, ...(fetchOptions.headers as Record<string, string>) },
    next: { revalidate: revalidate ?? 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Nemovizor API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

export async function searchProperties(
  params: SearchParams,
): Promise<SearchResult> {
  const query = new URLSearchParams();

  if (params.listing_type) query.set("listing_type", params.listing_type);
  if (params.category?.length) query.set("category", params.category.join(","));
  if (params.subtype?.length) query.set("subtype", params.subtype.join(","));
  if (params.city) query.set("city", params.city);
  if (params.country?.length) query.set("country", params.country.join(","));
  if (params.price_min) query.set("price_min", String(params.price_min));
  if (params.price_max) query.set("price_max", String(params.price_max));
  if (params.area_min) query.set("area_min", String(params.area_min));
  if (params.area_max) query.set("area_max", String(params.area_max));
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.agency_id) query.set("agency_id", params.agency_id);
  if (params.broker_id) query.set("broker_id", params.broker_id);

  // The HTTP API returns camelCase — normalise every property to snake_case
  const raw = await nemovizorFetch<{
    data: Record<string, unknown>[];
    total: number;
    page: number;
    pages: number;
    limit: number;
    nextCursor?: string | null;
  }>(`/properties?${query.toString()}`);

  return {
    data: raw.data.map(
      (p) => normalisePropertyKeys(p) as unknown as NemovizorProperty,
    ),
    total: raw.total,
    page: raw.page,
    pages: raw.pages,
    limit: raw.limit,
    next_cursor: raw.nextCursor ?? null,
  };
}

export async function getPropertyBySlug(
  slug: string,
): Promise<NemovizorProperty> {
  // The detail-by-slug endpoint returns camelCase; we normalise to snake_case
  const raw = await nemovizorFetch<{ data: Record<string, unknown> }>(
    `/properties/by-slug/${encodeURIComponent(slug)}`,
    { revalidate: 120 },
  );
  return normalisePropertyKeys(raw.data) as unknown as NemovizorProperty;
}

export async function getPropertyById(
  id: string,
): Promise<NemovizorProperty> {
  const raw = await nemovizorFetch<{ data: Record<string, unknown> }>(
    `/properties/${encodeURIComponent(id)}`,
    { revalidate: 120 },
  );
  return normalisePropertyKeys(raw.data) as unknown as NemovizorProperty;
}

export async function getBrokerContact(
  brokerId: string,
): Promise<BrokerContact> {
  return nemovizorFetch<BrokerContact>(
    `/brokers/${encodeURIComponent(brokerId)}/contact`,
    { revalidate: 300 },
  );
}

export async function getMapPoints(
  params: SearchParams & {
    sw_lat?: number;
    sw_lon?: number;
    ne_lat?: number;
    ne_lon?: number;
    zoom?: number;
  },
): Promise<MapPoint[]> {
  const query = new URLSearchParams();

  if (params.listing_type) query.set("listing_type", params.listing_type);
  if (params.category?.length) query.set("category", params.category.join(","));
  if (params.city) query.set("city", params.city);
  if (params.country?.length) query.set("country", params.country.join(","));
  if (params.price_min) query.set("price_min", String(params.price_min));
  if (params.price_max) query.set("price_max", String(params.price_max));
  if (params.area_min) query.set("area_min", String(params.area_min));
  if (params.area_max) query.set("area_max", String(params.area_max));
  if (params.sw_lat != null) query.set("sw_lat", String(params.sw_lat));
  if (params.sw_lon != null) query.set("sw_lon", String(params.sw_lon));
  if (params.ne_lat != null) query.set("ne_lat", String(params.ne_lat));
  if (params.ne_lon != null) query.set("ne_lon", String(params.ne_lon));
  if (params.zoom != null) query.set("zoom", String(params.zoom));

  const raw = await nemovizorFetch<Record<string, unknown>[]>(
    `/map-points?${query.toString()}`,
  );
  return raw.map(
    (p) => normalisePropertyKeys(p) as unknown as MapPoint,
  );
}

export async function getFilterOptions(
  params?: Partial<SearchParams>,
): Promise<FilterOptions> {
  const query = new URLSearchParams();

  if (params?.listing_type) query.set("listing_type", params.listing_type);
  if (params?.category?.length)
    query.set("category", params.category.join(","));
  if (params?.city) query.set("city", params.city);
  if (params?.country?.length)
    query.set("country", params.country.join(","));

  return nemovizorFetch<FilterOptions>(
    `/filter-options?${query.toString()}`,
    { revalidate: 300 },
  );
}

export async function createValuation(data: {
  category: string;
  city: string;
  area: number;
  email: string;
  street?: string;
  zip?: string;
  rooms_label?: string;
  condition?: string;
  year_built?: number;
  name?: string;
  phone?: string;
}): Promise<ValuationResult> {
  return nemovizorFetch<ValuationResult>("/valuations", {
    method: "POST",
    body: JSON.stringify(data),
    revalidate: 0,
  });
}

export async function aiSearch(
  query: string,
): Promise<AiSearchResult> {
  return nemovizorFetch<AiSearchResult>("/ai-search", {
    method: "POST",
    body: JSON.stringify({ query }),
    revalidate: 0,
  });
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatPrice(price: number, currency = "CZK"): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number): string {
  return `${new Intl.NumberFormat("cs-CZ").format(area)} m²`;
}
