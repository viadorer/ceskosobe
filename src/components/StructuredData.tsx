export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Česko Sobě",
    url: "https://www.ceskosobe.cz",
    description:
      "Soukromá iniciativa za finanční soběstačnost. Pomáháme lidem zajistit si důstojné stáří investicemi do nemovitostí.",
    foundingDate: "2024",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Co je Česko Sobě?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Soukromá iniciativa, která sdružuje lidi odhodlané zajistit si důstojné stáří vlastními silami. Ukazujeme cestu přes investiční nemovitosti a finanční gramotnost.",
        },
      },
      {
        "@type": "Question",
        name: "Proč nemovitosti?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nájemní nemovitost generuje pravidelný měsíční příjem, její hodnota roste s inflací a splácí se z nájmu. Na rozdíl od akcií nebo kryptoměn je to hmatatelné aktivum, kterému lidé rozumějí.",
        },
      },
      {
        "@type": "Question",
        name: "Musím mít miliony na to, abych začal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ne. Většina lidí v naší komunitě začínala s hypotékou a vlastními úsporami na zálohu. Klíčové je porozumět číslům a vybrat správnou nemovitost, ne mít velký kapitál na startu.",
        },
      },
      {
        "@type": "Question",
        name: "Jak se liší Česko Sobě od finančních poradců?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Finanční poradci prodávají produkty a berou provize. Česko Sobě je komunita, která sdílí zkušenosti. Žádné provize, žádné produkty. Jen fakta, čísla a vzájemná podpora.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Česko Sobě",
    url: "https://www.ceskosobe.cz",
    description:
      "Populace stárne, rodí se méně dětí. Na důchody nebudou peníze. Česko Sobě sdružuje lidi, kteří se rozhodli být aktivní.",
    inLanguage: "cs",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
