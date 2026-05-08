"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/nemovitosti", label: "Nemovitosti" },
    { href: "/kalkulacka", label: "Kalkulačka" },
    { href: "/oceneni", label: "Ocenění" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 top-[3px]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight"
          >
            <span className="text-cz-blue">Česko</span>
            <span className="text-cz-red">Sobě</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-cz-red"
                    : "text-cz-blue hover:text-cz-red"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-cz-blue"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-semibold py-2 transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-cz-red"
                    : "text-cz-blue hover:text-cz-red"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
