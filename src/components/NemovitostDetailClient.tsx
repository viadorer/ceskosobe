"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NemovizorProperty } from "@/lib/nemovizor";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(price: number, currency?: string | null): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: (currency || "CZK").toUpperCase(),
    maximumFractionDigits: 0,
  }).format(price);
}

function formatArea(area: number): string {
  return `${new Intl.NumberFormat("cs-CZ").format(area)} m²`;
}

const LISTING_TYPE_LABELS: Record<string, string> = {
  sale: "Prodej",
  rent: "Pronájem",
  auction: "Aukce",
  shares: "Podíly",
  project: "Projekt",
};

const CATEGORY_LABELS: Record<string, string> = {
  apartment: "Byt",
  house: "Dům",
  land: "Pozemek",
  commercial: "Komerční",
  other: "Ostatní",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-cz-red" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
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
      <Link
        href="/nemovitosti"
        className="mt-6 rounded-md bg-cz-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cz-blue-light"
      >
        Zpět na přehled
      </Link>
    </div>
  );
}

function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-lg bg-cz-bg">
        <svg
          className="h-16 w-16 text-gray-300"
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
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-cz-bg">
        <img
          src={images[activeIndex]}
          alt={`${title} - foto ${activeIndex + 1}`}
          className="h-full w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="Předchozí obrázek"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() =>
                setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="Další obrázek"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 right-3 rounded bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-md transition-all ${
                idx === activeIndex
                  ? "ring-2 ring-cz-red ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={src}
                alt={`${title} - foto ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NemovitostDetailClient({ slug }: { slug: string }) {
  const [property, setProperty] = useState<NemovizorProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/nemovizor/detail?slug=${encodeURIComponent(slug)}`,
        );
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(
            (body as { error?: string } | null)?.error ||
              `Chyba serveru (${res.status})`,
          );
        }
        const data: NemovizorProperty = await res.json();
        if (!cancelled) setProperty(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Nepodařilo se načíst detail nemovitosti.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cz-bg pt-28 pb-20">
        <Spinner />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-cz-bg pt-28 pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <ErrorMessage
            message={error || "Nemovitost nebyla nalezena."}
          />
        </div>
      </div>
    );
  }

  const images: string[] = property.images ?? [];
  const broker = property.brokers?.[0] ?? null;

  return (
    <div className="min-h-screen bg-cz-bg pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/nemovitosti"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cz-gray-light transition-colors hover:text-cz-blue"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Zpět na přehled
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left column: images + description */}
          <div className="lg:col-span-2">
            <ImageGallery images={images} title={property.title} />

            {/* Title */}
            <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-cz-blue md:text-3xl">
              {property.title}
            </h1>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {property.listing_type && (
                <span className="rounded bg-cz-red/10 px-3 py-1 text-xs font-semibold text-cz-red">
                  {LISTING_TYPE_LABELS[property.listing_type] || property.listing_type}
                </span>
              )}
              {property.category && (
                <span className="rounded bg-cz-blue/10 px-3 py-1 text-xs font-semibold text-cz-blue">
                  {CATEGORY_LABELS[property.category] || property.category}
                </span>
              )}
              {property.subtype && (
                <span className="rounded bg-cz-bg px-3 py-1 text-xs font-semibold text-cz-gray">
                  {property.subtype}
                </span>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-bold text-cz-blue">Popis</h2>
                <div className="whitespace-pre-line text-sm leading-relaxed text-cz-gray-light">
                  {property.description}
                </div>
              </div>
            )}
          </div>

          {/* Right column: info sidebar */}
          <div className="space-y-6">
            {/* Price card */}
            <div className="rounded-lg border border-gray-100 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-cz-gray-light">
                Cena
              </p>
              <p className="mt-1 text-2xl font-extrabold text-cz-blue">
                {formatPrice(property.price, property.price_currency)}
              </p>
              {property.listing_type === "rent" && (
                <p className="text-xs text-cz-gray-light">/ měsíc</p>
              )}
            </div>

            {/* Details card */}
            <div className="rounded-lg border border-gray-100 bg-white p-6">
              <h3 className="mb-4 text-sm font-bold text-cz-blue">
                Parametry
              </h3>
              <dl className="space-y-3 text-sm">
                {(property.location_label || property.city) && (
                  <div className="flex justify-between">
                    <dt className="text-cz-gray-light">Lokalita</dt>
                    <dd className="font-medium text-cz-gray text-right">
                      {property.location_label || property.city}
                    </dd>
                  </div>
                )}
                {property.street && (
                  <div className="flex justify-between">
                    <dt className="text-cz-gray-light">Ulice</dt>
                    <dd className="font-medium text-cz-gray">
                      {property.street}
                    </dd>
                  </div>
                )}
                {property.area != null && property.area > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-cz-gray-light">Plocha</dt>
                    <dd className="font-medium text-cz-gray">
                      {formatArea(property.area)}
                    </dd>
                  </div>
                )}
                {(property.rooms_label || property.subtype) && (
                  <div className="flex justify-between">
                    <dt className="text-cz-gray-light">Dispozice</dt>
                    <dd className="font-medium text-cz-gray">
                      {property.rooms_label || property.subtype}
                    </dd>
                  </div>
                )}
                {property.category && (
                  <div className="flex justify-between">
                    <dt className="text-cz-gray-light">Typ</dt>
                    <dd className="font-medium text-cz-gray">
                      {CATEGORY_LABELS[property.category] || property.category}
                    </dd>
                  </div>
                )}
                {property.condition && (
                  <div className="flex justify-between">
                    <dt className="text-cz-gray-light">Stav</dt>
                    <dd className="font-medium text-cz-gray">
                      {property.condition}
                    </dd>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex justify-between">
                    <dt className="text-cz-gray-light">Rok výstavby</dt>
                    <dd className="font-medium text-cz-gray">
                      {property.year_built}
                    </dd>
                  </div>
                )}
                {property.energy_rating && (
                  <div className="flex justify-between">
                    <dt className="text-cz-gray-light">Energetická třída</dt>
                    <dd className="font-medium text-cz-gray">
                      {property.energy_rating}
                    </dd>
                  </div>
                )}
                {property.floor != null && (
                  <div className="flex justify-between">
                    <dt className="text-cz-gray-light">Podlaží</dt>
                    <dd className="font-medium text-cz-gray">
                      {property.floor}{property.total_floors ? ` / ${property.total_floors}` : ""}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Broker card */}
            {broker && (
              <div className="rounded-lg border border-gray-100 bg-white p-6">
                <h3 className="mb-4 text-sm font-bold text-cz-blue">
                  Makléř
                </h3>
                <div className="flex items-center gap-4">
                  {broker.photo ? (
                    <img
                      src={broker.photo}
                      alt={broker.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cz-bg">
                      <svg
                        className="h-6 w-6 text-cz-gray-light"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-cz-gray">
                      {broker.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-lg border border-cz-red/20 bg-cz-red/5 p-6">
              <h3 className="text-sm font-bold text-cz-blue">
                Máte zájem o tuto nemovitost?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-cz-gray-light">
                Neváhejte nás kontaktovat. Rádi vám poskytneme více informací
                nebo domluvíme prohlídku.
              </p>
              <Link
                href="/#signup-form"
                className="mt-4 inline-block w-full rounded-md bg-cz-red px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-cz-red-dark"
              >
                Kontaktujte nás
              </Link>
            </div>

            {/* Calculator link */}
            <Link
              href="/kalkulacka"
              className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-5 transition-all hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cz-bg">
                <svg
                  className="h-5 w-5 text-cz-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-cz-blue">
                  Investiční kalkulačka
                </p>
                <p className="text-xs text-cz-gray-light">
                  Spočítejte si návratnost
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
