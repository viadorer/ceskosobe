"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";

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

function fmtNum(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    maximumFractionDigits: 0,
  }).format(value);
}

function fmtPct(value: number, decimals = 1): string {
  return new Intl.NumberFormat("cs-CZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Standard annuity monthly payment */
function annuityPayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/* ------------------------------------------------------------------ */
/* Slider + Input combo                                                */
/* ------------------------------------------------------------------ */

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  suffix?: string;
}) {
  const displayValue = format ? format(value) : String(value);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-cz-blue">{label}</label>
        <span className="text-sm font-bold text-cz-blue tabular-nums">
          {displayValue}
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cz-red"
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-cz-gray-light">
          {format ? format(min) : min}
          {suffix ? ` ${suffix}` : ""}
        </span>
        <span className="text-xs text-cz-gray-light">
          {format ? format(max) : max}
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
    </div>
  );
}

function NumberInputField({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-cz-blue mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-cz-gray focus:outline-none focus:ring-2 focus:ring-cz-red/30 focus:border-cz-red transition-colors tabular-nums"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-cz-gray-light">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result card                                                         */
/* ------------------------------------------------------------------ */

function ResultCard({
  label,
  value,
  sublabel,
  highlight,
}: {
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-lg border ${
        highlight
          ? "border-cz-red/20 bg-cz-red/5"
          : "border-gray-100 bg-white"
      }`}
    >
      <p className="text-xs font-semibold text-cz-gray-light uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className={`text-xl font-extrabold tabular-nums ${
          highlight ? "text-cz-red" : "text-cz-blue"
        }`}
      >
        {value}
      </p>
      {sublabel && (
        <p className="text-xs text-cz-gray-light mt-1">{sublabel}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export function KalkulackaClient() {
  /* Inputs */
  const [price, setPrice] = useState(3_500_000);
  const [ownFundsPct, setOwnFundsPct] = useState(20);
  const [rate, setRate] = useState(5.2);
  const [years, setYears] = useState(30);
  const [rent, setRent] = useState(15_000);
  const [mgmtCost, setMgmtCost] = useState(2_000);

  /* Calculations */
  const calc = useMemo(() => {
    const ownFunds = price * (ownFundsPct / 100);
    const mortgage = price - ownFunds;
    const monthlyPayment = annuityPayment(mortgage, rate, years);
    const monthlyCashFlow = rent - monthlyPayment - mgmtCost;
    const annualNetIncome = (rent - mgmtCost) * 12;
    const annualYield = price > 0 ? (annualNetIncome / price) * 100 : 0;
    const value20 = price * Math.pow(1.05, 20);
    const value30 = price * Math.pow(1.05, 30);

    return {
      ownFunds,
      mortgage,
      monthlyPayment,
      monthlyCashFlow,
      annualYield,
      value20,
      value30,
    };
  }, [price, ownFundsPct, rate, years, rent, mgmtCost]);

  const handlePriceChange = useCallback((v: number) => setPrice(v), []);
  const handleOwnFundsChange = useCallback((v: number) => setOwnFundsPct(v), []);
  const handleRateChange = useCallback((v: number) => setRate(v), []);
  const handleYearsChange = useCallback((v: number) => setYears(v), []);
  const handleRentChange = useCallback((v: number) => setRent(v), []);
  const handleMgmtChange = useCallback((v: number) => setMgmtCost(v), []);

  /* Monthly rent income after mortgage is paid off (in today's terms, simplified) */
  const rentAfterPayoff = rent - mgmtCost;
  const STATE_PENSION = 20_736;

  return (
    <section className="pt-28 pb-20 bg-cz-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-cz-red uppercase tracking-[0.2em] mb-4">
            Kalkulačka
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-cz-blue leading-tight">
            Investiční kalkulačka
          </h1>
          <p className="text-cz-gray-light mt-4 max-w-xl mx-auto leading-relaxed">
            Zadejte parametry investice a okamžitě uvidíte měsíční cash flow,
            návratnost a srovnání se státním důchodem.
          </p>
        </div>

        {/* Main grid: inputs + results */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Inputs */}
          <div className="lg:col-span-3 space-y-8 bg-white p-8 rounded-xl border border-gray-100">
            <h2 className="text-lg font-bold text-cz-blue border-b border-gray-100 pb-4">
              Parametry investice
            </h2>

            <SliderField
              label="Cena nemovitosti"
              value={price}
              min={1_000_000}
              max={10_000_000}
              step={100_000}
              onChange={handlePriceChange}
              format={fmtNum}
              suffix="Kč"
            />

            <SliderField
              label="Vlastní zdroje"
              value={ownFundsPct}
              min={10}
              max={50}
              step={1}
              onChange={handleOwnFundsChange}
              format={(v) => fmtPct(v, 0)}
              suffix="%"
            />

            <div className="pt-1">
              <p className="text-xs text-cz-gray-light mb-1">
                Vlastní vklad: {fmtCZK(calc.ownFunds)}
              </p>
            </div>

            <SliderField
              label="Úroková sazba"
              value={rate}
              min={2}
              max={8}
              step={0.1}
              onChange={handleRateChange}
              format={(v) => fmtPct(v)}
              suffix="%"
            />

            <SliderField
              label="Doba splácení"
              value={years}
              min={10}
              max={30}
              step={1}
              onChange={handleYearsChange}
              suffix="let"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <NumberInputField
                label="Měsíční nájem"
                value={rent}
                onChange={handleRentChange}
                suffix="Kč/měs."
                min={0}
                max={100_000}
              />
              <NumberInputField
                label="Náklady na správu"
                value={mgmtCost}
                onChange={handleMgmtChange}
                suffix="Kč/měs."
                min={0}
                max={50_000}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-cz-blue mb-2">
              Výsledky
            </h2>

            <ResultCard
              label="Výše hypotéky"
              value={fmtCZK(calc.mortgage)}
            />

            <ResultCard
              label="Měsíční splátka"
              value={fmtCZK(Math.round(calc.monthlyPayment))}
            />

            <ResultCard
              label="Měsíční cash flow"
              value={fmtCZK(Math.round(calc.monthlyCashFlow))}
              sublabel={
                calc.monthlyCashFlow >= 0
                  ? "Investice se splácí z nájmu"
                  : "Doplatíte z vlastních zdrojů"
              }
              highlight
            />

            <ResultCard
              label="Roční výnosnost"
              value={`${fmtPct(calc.annualYield)} %`}
              sublabel="Čistá výnosnost z ceny nemovitosti"
            />

            <ResultCard
              label="Hodnota za 20 let"
              value={fmtCZK(Math.round(calc.value20))}
              sublabel="Předpoklad 5 % roční zhodnocení"
            />

            <ResultCard
              label="Hodnota za 30 let"
              value={fmtCZK(Math.round(calc.value30))}
              sublabel="Předpoklad 5 % roční zhodnocení"
            />
          </div>
        </div>

        {/* Comparison with state pension */}
        <div className="mt-16">
          <p className="text-sm font-semibold text-cz-gray-light uppercase tracking-[0.2em] mb-6 text-center">
            Srovnání se státním důchodem
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* State pension */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-cz-gray-light"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-cz-blue">
                  Státní důchod
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-cz-gray-light uppercase tracking-wide mb-1">
                    Měsíční příjem
                  </p>
                  <p className="text-2xl font-extrabold text-cz-gray tabular-nums">
                    {fmtCZK(STATE_PENSION)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-cz-gray-light uppercase tracking-wide mb-1">
                    Hodnota majetku
                  </p>
                  <p className="text-2xl font-extrabold text-cz-gray tabular-nums">
                    {fmtCZK(0)}
                  </p>
                </div>
                <p className="text-xs text-cz-gray-light leading-relaxed pt-2 border-t border-gray-100">
                  Průměrný starobní důchod v ČR (2024). Žádný majetek, žádné
                  dědictví. Plná závislost na státním rozpočtu.
                </p>
              </div>
            </div>

            {/* Own property */}
            <div className="bg-white border-2 border-cz-red/20 rounded-xl p-8 relative">
              <div className="absolute -top-3 right-6 bg-cz-red text-white text-xs font-bold px-3 py-1 rounded-full">
                Vaše cesta
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-cz-red/10 flex items-center justify-center">
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-cz-blue">
                  Vlastní nemovitost
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-cz-gray-light uppercase tracking-wide mb-1">
                    Měsíční příjem z nájmu
                  </p>
                  <p className="text-2xl font-extrabold text-cz-red tabular-nums">
                    {fmtCZK(rentAfterPayoff)}
                  </p>
                  <p className="text-xs text-cz-gray-light">
                    Po splacení hypotéky (nájem mínus náklady)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-cz-gray-light uppercase tracking-wide mb-1">
                    Hodnota majetku za 30 let
                  </p>
                  <p className="text-2xl font-extrabold text-cz-red tabular-nums">
                    {fmtCZK(Math.round(calc.value30))}
                  </p>
                </div>
                <p className="text-xs text-cz-gray-light leading-relaxed pt-2 border-t border-gray-100">
                  Pasivní příjem z nájmu, nemovitost ve vašem vlastnictví. Můžete
                  ji prodat, darovat nebo dědičně předávat.
                </p>
              </div>
            </div>
          </div>

          {/* Difference highlight */}
          <div className="mt-8 bg-cz-blue rounded-xl p-6 text-center">
            <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">
              Rozdíl v měsíčním příjmu po splacení
            </p>
            <p className="text-3xl font-extrabold text-white tabular-nums">
              {rentAfterPayoff > STATE_PENSION ? "+" : ""}
              {fmtCZK(rentAfterPayoff - STATE_PENSION)}
            </p>
            <p className="text-white/40 text-xs mt-2">
              {rentAfterPayoff > STATE_PENSION
                ? "Příjem z nemovitosti převyšuje státní důchod"
                : rentAfterPayoff === STATE_PENSION
                  ? "Příjem z nemovitosti odpovídá státnímu důchodu"
                  : "Státní důchod převyšuje příjem z nemovitosti – zvyšte nájem nebo snižte náklady"}
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/nemovitosti"
            className="inline-block px-10 py-4 bg-cz-red hover:bg-cz-red-dark text-white font-semibold text-sm rounded transition-colors duration-200"
          >
            Najít vhodnou nemovitost
          </Link>
          <p className="text-xs text-cz-gray-light mt-4">
            Prohlédněte si aktuální nabídku investičních nemovitostí
          </p>
        </div>
      </div>
    </section>
  );
}
