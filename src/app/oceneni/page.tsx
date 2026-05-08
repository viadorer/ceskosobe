import type { Metadata } from "next";
import { OceneniClient } from "@/components/OceneniClient";

export const metadata: Metadata = {
  title: "Ocenění nemovitosti",
  description:
    "Zjistěte tržní hodnotu vaší nemovitosti na základě aktuálních dat z trhu. Výsledek obratem na e-mail.",
  openGraph: {
    title: "Ocenění nemovitosti | Česko Sobě",
    description:
      "Zjistěte tržní hodnotu nemovitosti na základě aktuálních dat z trhu.",
  },
};

export default function OceneniPage() {
  return <OceneniClient />;
}
