"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface ValuationResult {
  report_id: string;
  estimate_low: number;
  estimate_mid: number;
  estimate_high: number;
  currency: string;
}

interface FormData {
  category: string;
  city: string;
  street: string;
  zip: string;
  rooms_label: string;
  area: string;
  condition: string;
  year_built: string;
  name: string;
  email: string;
  phone: string;
}

const INITIAL_FORM: FormData = {
  category: "apartment",
  city: "",
  street: "",
  zip: "",
  rooms_label: "",
  area: "",
  condition: "",
  year_built: "",
  name: "",
  email: "",
  phone: "",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function fmtCZK(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

/* ------------------------------------------------------------------ */
/* Select options                                                      */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { value: "apartment", label: "Byt" },
  { value: "house", label: "Dům" },
  { value: "land", label: "Pozemek" },
  { value: "commercial", label: "Komerční" },
];

const DISPOSITIONS = [
  { value: "", label: "-- Vyberte --" },
  { value: "1+kk", label: "1+kk" },
  { value: "1+1", label: "1+1" },
  { value: "2+kk", label: "2+kk" },
  { value: "2+1", label: "2+1" },
  { value: "3+kk", label: "3+kk" },
  { value: "3+1", label: "3+1" },
  { value: "4+kk", label: "4+kk" },
  { value: "4+1", label: "4+1" },
  { value: "5+kk", label: "5+kk" },
  { value: "5+1", label: "5+1" },
];

const CONDITIONS = [
  { value: "", label: "-- Vyberte --" },
  { value: "new", label: "Novostavba" },
  { value: "reconstructed", label: "Po rekonstrukci" },
  { value: "before_reconstruction", label: "Před rekonstrukcí" },
  { value: "good", label: "Dobrý" },
];

/* ------------------------------------------------------------------ */
/* Form field components                                               */
/* ------------------------------------------------------------------ */

function TextField({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-cz-blue mb-2">
        {label}
        {required && <span className="text-cz-red ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-cz-gray placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cz-red/30 focus:border-cz-red transition-colors"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-cz-blue mb-2">
        {label}
        {required && <span className="text-cz-red ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-cz-gray bg-white focus:outline-none focus:ring-2 focus:ring-cz-red/30 focus:border-cz-red transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Success state                                                       */
/* ------------------------------------------------------------------ */

function ValuationSuccess({
  result,
  email,
}: {
  result: ValuationResult;
  email: string;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold text-cz-blue mb-2">
          Ocenění dokončeno
        </h2>
        <p className="text-sm text-cz-gray-light mb-8">
          Detailní report vám byl odeslán na e-mail{" "}
          <span className="font-semibold text-cz-blue">{email}</span>.
        </p>

        {/* Value range */}
        <div className="bg-cz-bg rounded-xl p-6 mb-8">
          <p className="text-xs text-cz-gray-light uppercase tracking-[0.15em] mb-4">
            Odhadovaná tržní hodnota
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-cz-gray-light mb-1">Spodní odhad</p>
              <p className="text-lg font-bold text-cz-blue tabular-nums">
                {fmtCZK(result.estimate_low)}
              </p>
            </div>
            <div className="border-x border-gray-200">
              <p className="text-xs text-cz-red font-semibold mb-1">
                Střední odhad
              </p>
              <p className="text-2xl font-extrabold text-cz-red tabular-nums">
                {fmtCZK(result.estimate_mid)}
              </p>
            </div>
            <div>
              <p className="text-xs text-cz-gray-light mb-1">Horní odhad</p>
              <p className="text-lg font-bold text-cz-blue tabular-nums">
                {fmtCZK(result.estimate_high)}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/nemovitosti"
          className="inline-block px-8 py-4 bg-cz-red hover:bg-cz-red-dark text-white font-semibold text-sm rounded transition-colors duration-200"
        >
          Prohlédnout nabídku nemovitostí
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export function OceneniClient() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValuationResult | null>(null);

  function handleChange(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    /* Client-side validation */
    if (!form.city.trim()) {
      setError("Vyplňte prosím město.");
      return;
    }
    if (!form.area.trim() || Number(form.area) <= 0) {
      setError("Zadejte prosím platnou plochu nemovitosti.");
      return;
    }
    if (!form.email.trim()) {
      setError("Vyplňte prosím e-mailovou adresu.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Zadejte prosím platnou e-mailovou adresu.");
      return;
    }

    setSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        category: form.category,
        city: form.city.trim(),
        area: Number(form.area),
        email: form.email.trim(),
      };

      if (form.street.trim()) payload.street = form.street.trim();
      if (form.zip.trim()) payload.zip = form.zip.trim();
      if (form.rooms_label) payload.rooms_label = form.rooms_label;
      if (form.condition) payload.condition = form.condition;
      if (form.year_built.trim()) {
        const yb = Number(form.year_built);
        if (!isNaN(yb) && yb > 0) payload.year_built = yb;
      }
      if (form.name.trim()) payload.name = form.name.trim();
      if (form.phone.trim()) payload.phone = form.phone.trim();

      const res = await fetch("/api/nemovizor/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error || "Došlo k chybě při oceňování. Zkuste to prosím později.",
        );
        return;
      }

      setResult(data as ValuationResult);
    } catch {
      setError("Nepodařilo se spojit se serverem. Zkuste to prosím později.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ------ Success state ------ */
  if (result) {
    return (
      <section className="pt-28 pb-20 bg-cz-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <ValuationSuccess result={result} email={form.email} />
        </div>
      </section>
    );
  }

  /* ------ Form state ------ */
  return (
    <section className="pt-28 pb-20 bg-cz-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-cz-red uppercase tracking-[0.2em] mb-4">
            Ocenění
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-cz-blue leading-tight">
            Ocenění nemovitosti
          </h1>
          <p className="text-cz-gray-light mt-4 max-w-xl mx-auto leading-relaxed">
            Vyplňte údaje o nemovitosti a získejte odhad tržní hodnoty na
            základě aktuálních dat z trhu.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-xl border border-gray-100 space-y-6"
            >
              <h2 className="text-lg font-bold text-cz-blue border-b border-gray-100 pb-4">
                Údaje o nemovitosti
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SelectField
                  label="Typ nemovitosti"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={CATEGORIES}
                  required
                />
                <TextField
                  label="Město"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="např. Praha"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextField
                  label="Ulice"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="např. Vinohradská"
                />
                <TextField
                  label="PSČ"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  placeholder="např. 120 00"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SelectField
                  label="Dispozice"
                  name="rooms_label"
                  value={form.rooms_label}
                  onChange={handleChange}
                  options={DISPOSITIONS}
                />
                <TextField
                  label="Plocha m²"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  required
                  type="number"
                  placeholder="např. 65"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SelectField
                  label="Stav"
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  options={CONDITIONS}
                />
                <TextField
                  label="Rok výstavby"
                  name="year_built"
                  value={form.year_built}
                  onChange={handleChange}
                  type="number"
                  placeholder="např. 1998"
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-cz-blue mb-4">
                  Kontaktní údaje
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <TextField
                    label="Jméno"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jan Novák"
                  />
                  <TextField
                    label="E-mail"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    type="email"
                    placeholder="jan@email.cz"
                  />
                </div>

                <div className="mt-6">
                  <TextField
                    label="Telefon"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+420 ..."
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-cz-red hover:bg-cz-red-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors duration-200"
              >
                {submitting ? "Odesílám..." : "Zjistit hodnotu nemovitosti"}
              </button>

              <p className="text-xs text-cz-gray-light text-center">
                Výsledek obdržíte obratem na zadaný e-mail.
              </p>
            </form>
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl border border-gray-100 sticky top-28">
              <h3 className="text-lg font-bold text-cz-blue mb-6">
                Proč znát hodnotu nemovitosti?
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-cz-bg rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-cz-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cz-blue mb-1">
                      Správné nacenění při prodeji
                    </h4>
                    <p className="text-xs text-cz-gray-light leading-relaxed">
                      Nemovitost naceněná pod tržní hodnotou znamená ztrátu.
                      Naceněná vysoko se neprodává. Přesný odhad je základ
                      úspěšného prodeje.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-cz-bg rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-cz-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cz-blue mb-1">
                      Vyhodnocení investice
                    </h4>
                    <p className="text-xs text-cz-gray-light leading-relaxed">
                      Znáte-li aktuální hodnotu, můžete spočítat skutečnou
                      návratnost investice a porovnat ji s alternativami.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-cz-bg rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-cz-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cz-blue mb-1">
                      Podklad pro financování
                    </h4>
                    <p className="text-xs text-cz-gray-light leading-relaxed">
                      Banky a hypoteční poradci vyžadují odhad tržní hodnoty.
                      Náš report vám pomůže při jednání o financování.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-cz-gray-light leading-relaxed">
                  Ocenění vychází z aktuálních dat z trhu a porovnatelných
                  transakcí v dané lokalitě. Jedná se o orientační odhad, nikoli
                  o znalecký posudek.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
