import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-cz-blue">
      <div className="w-full h-[3px] flex">
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-cz-blue" />
        <div className="flex-1 bg-cz-red" />
      </div>
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-lg font-extrabold text-white tracking-tight"
            >
              Česko<span className="text-cz-red">Sobě</span>
            </Link>
            <p className="text-xs text-white/30 mt-2">
              Soukromá iniciativa za finanční soběstačnost
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <Link
              href="/nemovitosti"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Nemovitosti
            </Link>
            <Link
              href="/kalkulacka"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Kalkulačka
            </Link>
            <Link
              href="/blog"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Blog
            </Link>
          </div>

          <p className="text-xs text-white/15">PTF reality, s.r.o.</p>
        </div>
      </div>
    </footer>
  );
}
