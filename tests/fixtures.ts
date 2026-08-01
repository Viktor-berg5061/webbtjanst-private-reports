import type { LegacyReportContent, PersonalReportV2Content } from "../convex/reportContract";

export function makeV2Report(industry: "plumbing" | "bakery"): PersonalReportV2Content {
  const plumbing = industry === "plumbing";
  const companyName = plumbing ? "Rörklart VVS AB" : "Månskensbageriet AB";
  const service = plumbing ? "Jour och installation" : "Surdegsbröd och café";
  const conceptNames = plumbing ? ["Trygg jour", "Lokalt hantverk", "Planerad service"] : ["Varmt kvarter", "Bageriets rytm", "Småskaligt premium"];
  const evidenceLedger = [
    { id: "e1", claim: plumbing ? "Samtal missas under jourtid" : "Beställningar kommer via rekommendationer", classification: "customer_stated" as const, sourceLabel: "synthetic handoff", explanation: "Uppgift från den aktuella dialogen." },
    { id: "e2", claim: plumbing ? "Telefoniflöde behöver verifieras" : "Beställningsflöde behöver verifieras", classification: "unknown" as const, sourceLabel: "open question", explanation: "Frågan är ännu inte verifierad." },
    { id: "e3", claim: "Den föreslagna effekten är kvalitativ", classification: "scenario" as const, sourceLabel: "analysis scenario", explanation: "Scenariot kräver validering innan det kan beskrivas som utfall." },
  ];
  return {
    kind: "personal_report_v2",
    schemaVersion: 2,
    companyProfile: {
      companyName,
      contactName: "Testkontakt",
      industry: plumbing ? "VVS" : "Bageri",
      location: plumbing ? "Uddevalla" : "Göteborg",
      audience: plumbing ? "Fastighetsägare och villaägare" : "Boende och lokala arbetsplatser",
      services: [service],
      currentDigitalPresence: [plumbing ? "Telefon" : "Instagram"],
      brandTraits: plumbing ? ["Trygg", "Snabb"] : ["Varm", "Lokal"],
    },
    evidenceLedger,
    currentSituation: {
      summary: plumbing ? "Jourbehovet syns inte tydligt i dagens kontaktväg." : "Bageriets lokala erbjudande saknar en samlad beställningsväg.",
      gaps: [{ title: plumbing ? "Jourinformation" : "Beställningsväg", description: plumbing ? "Kunder behöver förstå när och hur jouren svarar." : "Kunder behöver se sortiment och beställa utan att ringa.", evidenceIds: ["e1"] }],
    },
    opportunities: [
      { title: plumbing ? "Fånga jourärenden" : "Förenkla förbeställning", mechanism: plumbing ? "Tydlig serviceväg och kvalificerad kontakt." : "Tydligt sortiment och enkel kontaktväg.", potentialImpact: "Kvalitativ möjlighet att minska friktion.", evidenceIds: ["e1", "e3"], recommendedAction: "Verifiera nuläget och prova ett begränsat första upplägg." },
      { title: plumbing ? "Förklara serviceområdet" : "Visa dagens sortiment", mechanism: "Samla det viktigaste på en tydlig ingång.", potentialImpact: "Scenario för tydligare förväntningar.", evidenceIds: ["e2", "e3"], recommendedAction: "Bekräfta innehållet innan publicering." },
      { title: plumbing ? "Strukturera arbetsunderlaget" : "Strukturera beställningen", mechanism: "Fråga efter rätt grunduppgifter i ett avgränsat flöde.", potentialImpact: "Kvalitativ möjlighet att spara ett kompletterande steg.", evidenceIds: ["e1", "e2"], recommendedAction: "Testa flödet med verkliga men icke-känsliga exempel." },
    ],
    visualizations: [{ type: "comparison", title: "Kontaktflöde", description: "Kvalitativ jämförelse från underlaget.", evidenceIds: ["e1"], data: [{ label: "Idag", displayValue: "Otydligt", kind: "customer_stated" }, { label: "Möjligt läge", displayValue: "Strukturerat", kind: "scenario" }] }],
    customerJourney: [
      { stage: "Upptäckt", currentExperience: plumbing ? "Kunden söker jourinformation." : "Kunden söker dagens utbud.", futureExperience: "Kunden ser direkt om erbjudandet är relevant.", evidenceIds: ["e1", "e3"] },
      { stage: "Kontakt", currentExperience: "Kunden väljer en befintlig kontaktväg.", futureExperience: "Kunden leds till en tydlig nästa handling.", evidenceIds: ["e1", "e2"] },
      { stage: "Underlag", currentExperience: "Grunduppgifter kan behöva kompletteras.", futureExperience: "Rätt grunduppgifter samlas i ett avgränsat flöde.", evidenceIds: ["e2", "e3"] },
    ],
    conceptPreviews: conceptNames.map((name, index) => ({
      id: `${industry}-${index + 1}`,
      name,
      artDirection: index === 0 ? "Förtroende" : index === 1 ? "Lokal energi" : "Redaktionell tydlighet",
      rationale: `${name} bygger på ${plumbing ? "jour och hantverk" : "småskalig bakning och kvartersnärvaro"}.`,
      tradeoffs: [`Kräver prioriterat innehåll för riktning ${index + 1}`, `Behöver testas mot ${plumbing ? "jourflödet" : "beställningsrytmen"} i variant ${index + 1}`],
      palette: { background: index === 1 ? "#14251f" : "#f7f1e6", surface: "#ffffff", text: "#202020", accent: index === 2 ? "#9a3324" : "#8c5a1e", muted: "#6b6258", onAccent: "#ffffff" },
      hero: { eyebrow: plumbing ? "VVS · JOUR" : "BAGERI · KVARTER", headline: name, subheadline: plumbing ? "Hjälp när det behövs." : "Nära smaker för vardagen.", primaryCta: `${plumbing ? "Be om hjälp" : "Beställ bröd"} ${index + 1}`, secondaryCta: `Se ${plumbing ? "tjänster" : "sortiment"} ${index + 1}` },
      sections: [
        { heading: plumbing ? "Tjänster" : "Sortiment", body: `Agentens ${industry}-specifika riktning för ${service}.`, layout: index === 0 ? "split" : index === 1 ? "feature_grid" : "editorial" },
        { heading: plumbing ? "Serviceområde" : "Beställning", body: `Riktning ${index + 1} visar en tydlig väg från behov till kontakt.`, layout: "stack" },
        { heading: "Förtroende", body: `Bevis och antaganden hålls synliga i koncept ${index + 1}.`, layout: "editorial" },
      ],
      proofItems: [{ label: "Underlag", value: "E1", evidenceIds: ["e1"] }],
      mobile: { navigation: "Tjänster · Kontakt", primaryAction: plumbing ? "Ring jouren" : "Beställ" },
    })),
    recommendedOffer: {
      rationale: plumbing ? "Börja med tydlig jourkommunikation och verifiera telefoniflödet." : "Börja med ett enkelt sortiment och verifiera beställningsflödet.",
      components: [{ service: plumbing ? "Webbplats" : "Beställningssida", tier: "Pilot", oneTimePrice: { amount: plumbing ? 18000 : 14000, currency: "SEK", display: plumbing ? "18 000 SEK" : "14 000 SEK" }, monthlyPrice: null, includedItems: ["Strukturerad första version"] }],
      oneTimeTotal: { amount: plumbing ? 18000 : 14000, currency: "SEK", display: plumbing ? "18 000 SEK" : "14 000 SEK" },
      recurringMonthlyTotal: { amount: 0, currency: "SEK", display: "0 SEK / månad" },
      assumptions: [{ text: "Effekten är ett scenario, inte ett löfte.", classification: "scenario", evidenceIds: ["e3"] }],
      optionalAddOns: [{ service: plumbing ? "Jourguide" : "Beställningsstöd", tier: "Tillval", oneTimePrice: null, monthlyPrice: { amount: 500, currency: "SEK", display: "500 SEK / månad" }, includedItems: ["Avgränsad utökning"] }],
      alternatives: [{ service: plumbing ? "Telefoniguide" : "Nyhetsbrev", tier: "Tillval", oneTimePrice: null, monthlyPrice: { amount: 900, currency: "SEK", display: "900 SEK / månad" }, includedItems: ["Avgränsat tillval"], rationale: "Kan prövas efter verifiering." }],
    },
    nextSteps: ["Verifiera nuläget", "Välj riktning", "Godkänn nästa underlag"],
    neededFromCustomer: ["Prioriterade tjänster", "Kontaktvägar"],
    disclaimer: "Kvalitativt underlag. Uppskattningar och scenarier är märkta.",
    theme: { accent: plumbing ? "#2563eb" : "#9a3324", tone: plumbing ? "technical" : "warm" },
  };
}

export const legacyReport: LegacyReportContent = {
  companyName: "Äldre Kund AB",
  title: "Äldre rapport",
  introduction: "Legacy-innehåll ska fortfarande visas.",
  observations: ["En äldre observation."],
  recommendation: { summary: "Legacy-rekommendation.", website: "Legacy-webbplats.", receptionist: "Legacy-receptionist.", pricing: "Legacy-pris." },
  nextSteps: ["Legacy nästa steg."],
  neededFromCustomer: ["Legacy underlag."],
};
