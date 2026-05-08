const NEMOVIZOR_BASE = process.env.NEMOVIZOR_API_URL || "https://api.nemovizor.cz";
const NEMOVIZOR_KEY = process.env.NEMOVIZOR_API_KEY || "";

export interface NemovizorProperty {
  id: string;
  slug: string;
  title: string;
  listing_type: "sale" | "rent" | "auction" | "shares" | "project";
  category: "apartment" | "house" | "land" | "commercial" | "other";
  subtype?: string;
  price: number;
  price_currency: string;
  area?: number;
  city?: string;
  street?: string;
  country?: string;
  description?: string;
  images?: { url: string; title?: string; order?: number }[];
  brokers?: { id: string; name: string; photo?: string }[];
  created_at?: string;
  updated_at?: string;
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
}

export interface SearchResult {
  data: NemovizorProperty[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface MapPoint {
  id: string;
  slug: string;
  lat: number;
  lon: number;
  price?: number;
  title?: string;
  category?: string;
}

export interface FilterOptions {
  categories: { value: string; label: string; count: number }[];
  subtypes: { value: string; label: string; count: number }[];
  cities: { value: string; count: number }[];
  price_range: { min: number; max: number };
  area_range: { min: number; max: number };
}

export interface ValuationResult {
  report_id: string;
  estimate_low: number;
  estimate_mid: number;
  estimate_high: number;
  currency: string;
}

async function nemovizorFetch(path: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (NEMOVIZOR_KEY) {
    headers["Authorization"] = `Bearer ${NEMOVIZOR_KEY}`;
  }

  const res = await fetch(`${NEMOVIZOR_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Nemovizor API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function searchProperties(params: SearchParams): Promise<SearchResult> {
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

  return nemovizorFetch(`/v1/properties?${query.toString()}`);
}

export async function getPropertyBySlug(slug: string): Promise<NemovizorProperty> {
  return nemovizorFetch(`/v1/properties/slug/${slug}`);
}

export async function getMapPoints(params: SearchParams & {
  sw_lat?: number;
  sw_lon?: number;
  ne_lat?: number;
  ne_lon?: number;
  zoom?: number;
}): Promise<MapPoint[]> {
  const query = new URLSearchParams();

  if (params.listing_type) query.set("listing_type", params.listing_type);
  if (params.category?.length) query.set("category", params.category.join(","));
  if (params.city) query.set("city", params.city);
  if (params.sw_lat) query.set("sw_lat", String(params.sw_lat));
  if (params.sw_lon) query.set("sw_lon", String(params.sw_lon));
  if (params.ne_lat) query.set("ne_lat", String(params.ne_lat));
  if (params.ne_lon) query.set("ne_lon", String(params.ne_lon));
  if (params.zoom) query.set("zoom", String(params.zoom));

  return nemovizorFetch(`/v1/properties/map?${query.toString()}`);
}

export async function getFilterOptions(params?: Partial<SearchParams>): Promise<FilterOptions> {
  const query = new URLSearchParams();

  if (params?.listing_type) query.set("listing_type", params.listing_type);
  if (params?.category?.length) query.set("category", params.category.join(","));
  if (params?.city) query.set("city", params.city);

  return nemovizorFetch(`/v1/properties/filters?${query.toString()}`);
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
  return nemovizorFetch("/v1/valuations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function formatPrice(price: number, currency = "CZK"): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number): string {
  return `${area} m²`;
}
