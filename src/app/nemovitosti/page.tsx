import type { Metadata } from "next";
import { Suspense } from "react";
import { NemovitostiClient } from "@/components/NemovitostiClient";

export const metadata: Metadata = {
  title: "Investiční nemovitosti",
  description:
    "Prohlédněte si aktuální nabídku investičních nemovitostí v celé ČR. Filtrujte podle města, ceny, dispozice a typu.",
  openGraph: {
    title: "Investiční nemovitosti | Česko Sobě",
    description:
      "Aktuální nabídka investičních bytů a domů v celé České republice.",
  },
};

export default function NemovitostiPage() {
  return (
    <Suspense>
      <NemovitostiClient />
    </Suspense>
  );
}
