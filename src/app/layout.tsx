import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ceskosobe.cz"),
  title: {
    default: "Česko Sobě | Musíme si pomoct sami",
    template: "%s | Česko Sobě",
  },
  description:
    "Populace stárne, rodí se méně dětí. Na důchody nebudou peníze. Česko Sobě sdružuje lidi, kteří se rozhodli být aktivní.",
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "Česko Sobě",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${montserrat.variable} antialiased`}>
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className="bg-white font-sans min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 w-full h-[3px] z-60 flex">
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-cz-blue" />
          <div className="flex-1 bg-cz-red" />
        </div>

        <Navigation />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
