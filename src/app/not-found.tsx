import Link from "next/link";
import { TrikoloraCentered } from "@/components/Trikolora";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-6xl font-extrabold text-cz-blue mb-4">404</h1>
        <p className="text-xl font-bold text-cz-blue mb-2">
          Stránka nenalezena
        </p>
        <p className="text-cz-gray-light mb-8">
          Tato stránka neexistuje nebo byla přesunuta.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-cz-red text-white font-semibold text-sm rounded hover:bg-cz-red-dark transition-colors"
          >
            Zpět na hlavní stránku
          </Link>
          <Link
            href="/nemovitosti"
            className="inline-block px-8 py-3 border-2 border-cz-blue text-cz-blue font-semibold text-sm rounded hover:bg-cz-blue hover:text-white transition-colors"
          >
            Prohlédnout nemovitosti
          </Link>
        </div>

        <TrikoloraCentered />
      </div>
    </section>
  );
}
