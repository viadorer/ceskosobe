"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { NemovizorProperty, SearchResult } from "@/lib/nemovizor";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LISTING_TYPES = [
  { value: "sale", label: "Prodej" },
  { value: "rent", label: "Pronájem" },
] as const;

const SUBTYPES = [
  { value: "1+kk", label: "1+kk" },
  { value: "2+kk", label: "2+kk" },
  { value: "2+1", label: "2+1" },
  { value: "3+kk", label: "3+kk" },
  { value: "3+1", label: "3+1" },
  { value: "4+kk", label: "4+kk" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Nejnovější" },
  { value: "price_asc", label: "Nejlevnější" },
  { value: "price_desc", label: "Nejdražší" },
  { value: "area_desc", label: "Největší" },
] as const;

const PAGE_SIZE = 12;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(price: number, currency = "CZK"): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatArea(area: number): string {
  return `${new Intl.NumberFormat("cs-CZ").format(area)} m²`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-cz-red" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="mb-6 h-16 w-16 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 className="text-lg font-bold text-cz-blue">
        Žádné nemovitosti nenalezeny
      </h3>
      <p className="mt-2 max-w-sm text-sm text-cz-gray-light">
        Zkuste upravit filtry nebo vyhledávací kritéria. Možná najdete to pravé
        s jinými parametry.
      </p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="mb-6 h-16 w-16 text-cz-red/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-bold text-cz-blue">Něco se pokazilo</h3>
      <p className="mt-2 max-w-sm text-sm text-cz-gray-light">{message}</p>
    </div>
  );
}

function PropertyCard({ property }: { property: NemovizorProperty }) {
  const thumbnail = property.image_src ?? property.images?.[0] ?? null;

  return (
    <Link
      href={`/nemovitosti/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cz-bg">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
        )}
        {/* Price badge */}
        <div className="absolute bottom-3 left-3 rounded bg-cz-blue/90 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
          {formatPrice(property.price, property.price_currency)}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-sm font-bold text-cz-blue transition-colors group-hover:text-cz-red">
          {property.title}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cz-gray-light">
          {(property.city || property.location_label) && (
            <span className="flex items-center gap-1">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {property.location_label || property.city}
            </span>
          )}
          {property.area != null && property.area > 0 && (
            <span>{formatArea(property.area)}</span>
          )}
          {(property.subtype || property.rooms_label) && (
            <span className="rounded bg-cz-bg px-2 py-0.5 font-medium text-cz-blue">
              {property.rooms_label || property.subtype}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build page numbers to show: always show first, last, current, and neighbors
  const pages: (number | "dots")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "dots") {
      pages.push("dots");
    }
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded border border-gray-200 px-4 py-2 text-sm font-medium text-cz-blue transition-colors hover:bg-cz-bg disabled:cursor-not-allowed disabled:opacity-40"
      >
        Předchozí
      </button>

      <div className="hidden items-center gap-1 sm:flex">
        {pages.map((p, idx) =>
          p === "dots" ? (
            <span
              key={`dots-${idx}`}
              className="px-2 text-sm text-cz-gray-light"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-9 min-w-[36px] rounded text-sm font-medium transition-colors ${
                p === page
                  ? "bg-cz-blue text-white"
                  : "text-cz-blue hover:bg-cz-bg"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <span className="text-sm text-cz-gray-light sm:hidden">
        {page} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded border border-gray-200 px-4 py-2 text-sm font-medium text-cz-blue transition-colors hover:bg-cz-bg disabled:cursor-not-allowed disabled:opacity-40"
      >
        Další
      </button>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NemovitostiClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const [listingType, setListingType] = useState(
    searchParams.get("typ") || "sale",
  );
  const [city, setCity] = useState(searchParams.get("mesto") || "");
  const [priceMin, setPriceMin] = useState(searchParams.get("cena_od") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("cena_do") || "");
  const [areaMin, setAreaMin] = useState(searchParams.get("plocha_od") || "");
  const [areaMax, setAreaMax] = useState(searchParams.get("plocha_do") || "");
  const [subtype, setSubtype] = useState(searchParams.get("dispozice") || "");
  const [sort, setSort] = useState(searchParams.get("razeni") || "newest");
  const [page, setPage] = useState(
    Number(searchParams.get("strana")) || 1,
  );

  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build API query string from current filters
  const buildQuery = useCallback(
    (pageOverride?: number) => {
      const q = new URLSearchParams();
      q.set("listing_type", listingType);
      if (city.trim()) q.set("city", city.trim());
      if (priceMin) q.set("price_min", priceMin);
      if (priceMax) q.set("price_max", priceMax);
      if (areaMin) q.set("area_min", areaMin);
      if (areaMax) q.set("area_max", areaMax);
      if (subtype) q.set("subtype", subtype);
      if (sort) q.set("sort", sort);
      q.set("page", String(pageOverride ?? page));
      q.set("limit", String(PAGE_SIZE));
      return q.toString();
    },
    [listingType, city, priceMin, priceMax, areaMin, areaMax, subtype, sort, page],
  );

  // Sync state to URL search params
  const syncUrl = useCallback(
    (pageOverride?: number) => {
      const q = new URLSearchParams();
      q.set("typ", listingType);
      if (city.trim()) q.set("mesto", city.trim());
      if (priceMin) q.set("cena_od", priceMin);
      if (priceMax) q.set("cena_do", priceMax);
      if (areaMin) q.set("plocha_od", areaMin);
      if (areaMax) q.set("plocha_do", areaMax);
      if (subtype) q.set("dispozice", subtype);
      if (sort && sort !== "newest") q.set("razeni", sort);
      const p = pageOverride ?? page;
      if (p > 1) q.set("strana", String(p));
      router.replace(`/nemovitosti?${q.toString()}`, { scroll: false });
    },
    [router, listingType, city, priceMin, priceMax, areaMin, areaMax, subtype, sort, page],
  );

  // Fetch results
  const fetchResults = useCallback(
    async (pageOverride?: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/nemovizor/search?${buildQuery(pageOverride)}`,
        );
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(
            (body as { error?: string } | null)?.error ||
              `Chyba serveru (${res.status})`,
          );
        }
        const data: SearchResult = await res.json();
        setResults(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Nepodařilo se načíst nemovitosti. Zkuste to prosím znovu.",
        );
      } finally {
        setLoading(false);
      }
    },
    [buildQuery],
  );

  // Initial fetch
  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search submit
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    syncUrl(1);
    fetchResults(1);
  }

  // Handle page change
  function handlePageChange(newPage: number) {
    setPage(newPage);
    syncUrl(newPage);
    fetchResults(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-cz-bg pt-28 pb-20">
      {/* Header */}
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-cz-blue md:text-4xl">
            Investiční nemovitosti
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cz-gray-light">
            Prohlédněte si aktuální nabídku nemovitostí vhodných k investici.
            Filtrujte podle svých požadavků a najděte tu pravou.
          </p>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="mb-10 rounded-lg border border-gray-100 bg-white p-6"
        >
          {/* Listing type toggle */}
          <div className="mb-6 flex gap-1 rounded-lg bg-cz-bg p-1">
            {LISTING_TYPES.map((lt) => (
              <button
                key={lt.value}
                type="button"
                onClick={() => setListingType(lt.value)}
                className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${
                  listingType === lt.value
                    ? "bg-cz-blue text-white shadow-sm"
                    : "text-cz-gray-light hover:text-cz-blue"
                }`}
              >
                {lt.label}
              </button>
            ))}
          </div>

          {/* Filter grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="mb-1.5 block text-xs font-semibold text-cz-blue"
              >
                Město
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="např. Praha"
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-cz-gray outline-none transition-colors placeholder:text-gray-400 focus:border-cz-blue focus:ring-1 focus:ring-cz-blue/20"
              />
            </div>

            {/* Price min */}
            <div>
              <label
                htmlFor="price-min"
                className="mb-1.5 block text-xs font-semibold text-cz-blue"
              >
                Cena od (Kč)
              </label>
              <input
                id="price-min"
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="0"
                min={0}
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-cz-gray outline-none transition-colors placeholder:text-gray-400 focus:border-cz-blue focus:ring-1 focus:ring-cz-blue/20"
              />
            </div>

            {/* Price max */}
            <div>
              <label
                htmlFor="price-max"
                className="mb-1.5 block text-xs font-semibold text-cz-blue"
              >
                Cena do (Kč)
              </label>
              <input
                id="price-max"
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="bez limitu"
                min={0}
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-cz-gray outline-none transition-colors placeholder:text-gray-400 focus:border-cz-blue focus:ring-1 focus:ring-cz-blue/20"
              />
            </div>

            {/* Disposition */}
            <div>
              <label
                htmlFor="subtype"
                className="mb-1.5 block text-xs font-semibold text-cz-blue"
              >
                Dispozice
              </label>
              <select
                id="subtype"
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-cz-gray outline-none transition-colors focus:border-cz-blue focus:ring-1 focus:ring-cz-blue/20"
              >
                <option value="">Všechny</option>
                {SUBTYPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Area min */}
            <div>
              <label
                htmlFor="area-min"
                className="mb-1.5 block text-xs font-semibold text-cz-blue"
              >
                Plocha od (m²)
              </label>
              <input
                id="area-min"
                type="number"
                value={areaMin}
                onChange={(e) => setAreaMin(e.target.value)}
                placeholder="0"
                min={0}
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-cz-gray outline-none transition-colors placeholder:text-gray-400 focus:border-cz-blue focus:ring-1 focus:ring-cz-blue/20"
              />
            </div>

            {/* Area max */}
            <div>
              <label
                htmlFor="area-max"
                className="mb-1.5 block text-xs font-semibold text-cz-blue"
              >
                Plocha do (m²)
              </label>
              <input
                id="area-max"
                type="number"
                value={areaMax}
                onChange={(e) => setAreaMax(e.target.value)}
                placeholder="bez limitu"
                min={0}
                className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-cz-gray outline-none transition-colors placeholder:text-gray-400 focus:border-cz-blue focus:ring-1 focus:ring-cz-blue/20"
              />
            </div>

            {/* Sort */}
            <div>
              <label
                htmlFor="sort"
                className="mb-1.5 block text-xs font-semibold text-cz-blue"
              >
                Řazení
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-cz-gray outline-none transition-colors focus:border-cz-blue focus:ring-1 focus:ring-cz-blue/20"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-md bg-cz-red px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cz-red-dark"
              >
                Vyhledat
              </button>
            </div>
          </div>
        </form>

        {/* Results count */}
        {!loading && results && !error && (
          <p className="mb-6 text-sm text-cz-gray-light">
            {results.total === 0
              ? "Nenalezeny žádné nemovitosti"
              : `Nalezeno ${new Intl.NumberFormat("cs-CZ").format(results.total)} nemovitostí`}
          </p>
        )}

        {/* Content */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : results && results.data.length === 0 ? (
          <EmptyState />
        ) : results ? (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.data.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              page={results.page}
              totalPages={results.pages}
              onPageChange={handlePageChange}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
