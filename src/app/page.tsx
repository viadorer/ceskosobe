import Link from "next/link";
import { Trikolora, TrikoloraCentered } from "@/components/Trikolora";
import { NewsletterForm } from "@/components/NewsletterForm";
import { FAQSchema } from "@/components/StructuredData";

const stats = [
  {
    value: "1,37",
    color: "text-cz-blue",
    text: "Tolik dětí se v průměru rodí na jednu ženu v ČR (2024). Pro udržení populace je potřeba 2,1. Pokles z 1,83 v roce 2021 -- trend je prudce sestupný.",
  },
  {
    value: "2 : 1",
    color: "text-cz-blue",
    text: "Poměr pracujících k důchodcům v roce 2050. Dnes jsou to přibližně 3 pracující na jednoho seniora. Systém průběžného financování to neunese.",
  },
  {
    value: "30 %",
    color: "text-cz-red",
    text: "Tolik populace bude starší 65 let v roce 2050. Dnes je to 21 %. Z 2,26 milionu na více než 3 miliony za jednu generaci.",
  },
  {
    value: "20 736 Kč",
    color: "text-cz-blue",
    text: "Průměrný starobní důchod dnes (2024). A to ještě systém relativně funguje. Co bude za 20 let, si dokáže spočítat každý.",
  },
];

const pillars = [
  {
    num: "I.",
    title: "Porozumění",
    text: "Finanční gramotnost není luxus. Je to základní dovednost, kterou nás nikdo nenaučil. Sdílíme reálné zkušenosti a čísla, aby se každý mohl rozhodovat na základě faktů, ne emocí.",
  },
  {
    num: "II.",
    title: "Soběstačnost",
    text: "Člověk, který má vlastní příjem z nájmu, není závislý na státním rozpočtu. Nejenže se postará o sebe a svou rodinu, ale zároveň uvolní ruce systému pro ty, kteří pomoc skutečně potřebují.",
  },
  {
    num: "III.",
    title: "Komunita",
    text: "Nejde o to, kdo má víc bytů. Jde o to, aby si co nejvíc lidí dokázalo zajistit důstojné stáří. Sdílíme příběhy, zkušenosti a pomáháme si navzájem udělat ten první krok.",
  },
];

const faqs = [
  {
    q: "Co je Česko Sobě?",
    a: "Soukromá iniciativa, která sdružuje lidi odhodlané zajistit si důstojné stáří vlastními silami. Ukazujeme cestu přes investiční nemovitosti a finanční gramotnost.",
  },
  {
    q: "Proč nemovitosti?",
    a: "Nájemní nemovitost generuje pravidelný měsíční příjem, její hodnota roste s inflací a splácí se z nájmu. Na rozdíl od akcií nebo kryptoměn je to hmatatelné aktivum, kterému lidé rozumějí.",
  },
  {
    q: "Musím mít miliony na to, abych začal?",
    a: "Ne. Většina lidí v naší komunitě začínala s hypotékou a vlastními úsporami na zálohu. Klíčové je porozumět číslům a vybrat správnou nemovitost, ne mít velký kapitál na startu.",
  },
  {
    q: "Není to pozdě, když mi je přes 40?",
    a: "Nejlepší čas začít byl před deseti lety. Druhý nejlepší čas je teď. Každý rok, který zbývá do důchodu, je rok, kdy pro sebe můžete něco udělat. Čím dříve začnete, tím víc času má váš plán na to fungovat.",
  },
  {
    q: "Jak se liší Česko Sobě od finančních poradců?",
    a: "Finanční poradci prodávají produkty a berou provize. Česko Sobě je komunita, která sdílí zkušenosti. Žádné provize, žádné produkty. Jen fakta, čísla a vzájemná podpora.",
  },
];

export default function HomePage() {
  return (
    <>
      <FAQSchema />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 pt-28 pb-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-cz-red uppercase tracking-[0.2em] mb-10 animate-fade-in">
              Soukromá iniciativa
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-cz-blue leading-[1.05] tracking-tight animate-fade-in">
              Musíme si
              <br />
              pomoct sami.
            </h1>

            <div className="mt-12 animate-fade-in-delay">
              <p className="text-xl md:text-2xl text-cz-gray leading-relaxed font-medium">
                Průměrný důchod: 20 736 Kč. Průměrné náklady na život: přes
                31 000 Kč. Ten rozdíl za vás nikdo nevyřeší.
              </p>
              <p className="text-lg text-cz-gray-light leading-relaxed mt-6">
                To není kritika systému. To je matematika. A řešení má jen ten,
                kdo začne jednat dřív, než bude pozdě.
              </p>
            </div>

            <div className="mt-12 animate-fade-in-delay-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/nemovitosti"
                className="inline-block px-8 py-4 bg-cz-red hover:bg-cz-red-dark text-white font-semibold text-sm rounded transition-colors duration-200 text-center"
              >
                Prohlédnout nemovitosti
              </Link>
              <Link
                href="/kalkulacka"
                className="inline-block px-8 py-4 border-2 border-cz-blue text-cz-blue hover:bg-cz-blue hover:text-white font-semibold text-sm rounded transition-colors duration-200 text-center"
              >
                Spočítat investici
              </Link>
            </div>

            <div className="mt-16 animate-fade-in-delay-3">
              <Trikolora />
            </div>
          </div>
        </div>
      </section>

      {/* Demografie */}
      <section className="py-28 bg-cz-bg border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="text-sm font-semibold text-cz-gray-light uppercase tracking-[0.2em] mb-16 text-center">
            Demografická realita
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
            {stats.map((stat) => (
              <div key={stat.value}>
                <div className={`text-5xl font-extrabold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-sm text-cz-gray-light mt-3 leading-relaxed">
                  {stat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-2xl md:text-3xl font-bold text-cz-blue leading-snug mb-6">
            Každý rok, který čekáte, vás stojí víc, než si myslíte.
          </p>
          <p className="text-cz-gray-light leading-relaxed mb-8">
            Ceny nemovitostí rostou. Inflace znehodnocuje úspory. Jediný správný
            čas začít je teď.
          </p>
          <Link
            href="/kalkulacka"
            className="inline-block px-8 py-4 bg-cz-red hover:bg-cz-red-dark text-white font-semibold text-sm rounded transition-colors duration-200"
          >
            Spočítat si to
          </Link>
        </div>
      </section>

      {/* Manifest */}
      <section className="py-28 bg-white">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="space-y-10 text-cz-gray">
            <p className="text-2xl md:text-3xl font-bold text-cz-blue leading-snug">
              Nikomu nic nevyčítáme. Ale matematika je neúprosná.
            </p>
            <p className="text-lg leading-relaxed">
              Když se rodí méně dětí a lidé žijí déle, průběžný důchodový systém
              nemá odkud brát. Není to jen český problém -- stejnou situaci řeší
              Německo, Japonsko, Itálie i desítky dalších zemí. Nikde na světě to
              za vás nevyřeší stát.
            </p>
            <p className="text-lg leading-relaxed">
              Česko Sobě sdružuje lidi, kteří se rozhodli být aktivní. Ne proti
              systému. Vedle něj. Budují si vlastní finanční zajištění, protože
              vědí, že čekání není strategie.
            </p>
            <p className="text-lg leading-relaxed">
              Nejčastější cesta? Nájemní nemovitost. Byt, který měsíc co měsíc
              generuje příjem. Který se splácí z nájmu. A jehož hodnota roste
              s inflací.
            </p>
            <p className="text-xl font-bold text-cz-blue leading-snug">
              Za 20 let budete rádi, že jste začali dnes. Nebo budete litovat, že
              jste nezačali.
            </p>
          </div>
        </div>
      </section>

      {/* Pilíře */}
      <section className="py-28 bg-cz-blue">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="text-sm font-semibold text-white/40 uppercase tracking-[0.2em] mb-6 text-center">
            Na čem stavíme
          </p>
          <p className="text-white/50 text-center text-sm leading-relaxed max-w-2xl mx-auto mb-16">
            Když se občané dokážou finančně zajistit sami, vyhrávají všichni.
            Člověk má důstojný život. Rodina má stabilitu. A stát nemusí řešit,
            z čeho zaplatí další generaci důchodů.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pillars.map((p) => (
              <div key={p.num}>
                <div className="text-4xl font-extrabold text-white/10 mb-4">
                  {p.num}
                </div>
                <h3 className="text-white font-bold text-lg mb-4">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nástroje */}
      <section className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="text-sm font-semibold text-cz-gray-light uppercase tracking-[0.2em] mb-6 text-center">
            Nástroje
          </p>
          <p className="text-2xl md:text-3xl font-bold text-cz-blue leading-snug text-center mb-16">
            Konkrétní pomoc, ne prázdné rady
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/nemovitosti"
              className="group p-8 border border-gray-100 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-cz-bg rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-cz-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-cz-blue mb-3 group-hover:text-cz-red transition-colors">
                Vyhledávač nemovitostí
              </h3>
              <p className="text-sm text-cz-gray-light leading-relaxed">
                Aktuální nabídka investičních bytů v celé ČR. Filtrujte podle města, ceny, dispozice a typu.
              </p>
            </Link>

            <Link
              href="/kalkulacka"
              className="group p-8 border border-gray-100 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-cz-bg rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-cz-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-cz-blue mb-3 group-hover:text-cz-red transition-colors">
                Investiční kalkulačka
              </h3>
              <p className="text-sm text-cz-gray-light leading-relaxed">
                Spočítejte si měsíční cash flow, návratnost investice a srovnání se státním důchodem.
              </p>
            </Link>

            <Link
              href="/oceneni"
              className="group p-8 border border-gray-100 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-cz-bg rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-cz-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-cz-blue mb-3 group-hover:text-cz-red transition-colors">
                Ocenění nemovitosti
              </h3>
              <p className="text-sm text-cz-gray-light leading-relaxed">
                Zjistěte tržní hodnotu nemovitosti na základě aktuálních dat z trhu. Výsledek obratem na e-mail.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-cz-bg border-t border-gray-100" id="signup-form">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cz-blue mb-6">
            Vezměte budoucnost do vlastních rukou
          </h2>
          <p className="text-cz-gray-light leading-relaxed mb-4">
            Připravujeme platformu, která vám ukáže cestu k finanční
            nezávislosti krok za krokem. Žádné sliby, jen reálná čísla
            a zkušenosti lidí, kteří už začali.
          </p>
          <p className="text-cz-gray-light leading-relaxed mb-12 text-sm">
            Nechte nám e-mail a pošleme vám přístup mezi prvními. Nic jiného
            posílat nebudeme.
          </p>

          <NewsletterForm />

          <div className="mt-16">
            <TrikoloraCentered />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <p className="text-sm font-semibold text-cz-gray-light uppercase tracking-[0.2em] mb-16 text-center">
            Časté otázky
          </p>

          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-lg font-bold text-cz-blue mb-3">
                  {faq.q}
                </h3>
                <p className="text-cz-gray-light leading-relaxed text-sm">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
