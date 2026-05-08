import type { Metadata } from "next";
import { KalkulackaClient } from "@/components/KalkulackaClient";

export const metadata: Metadata = {
  title: "Investiční kalkulačka",
  description:
    "Spočítejte si měsíční cash flow, návratnost investice do nemovitosti a srovnání se státním důchodem. Interaktivní kalkulačka pro investory.",
  openGraph: {
    title: "Investiční kalkulačka | Česko Sobě",
    description:
      "Spočítejte si měsíční cash flow, návratnost investice a srovnání se státním důchodem.",
  },
};

export default function KalkulackaPage() {
  return <KalkulackaClient />;
}
