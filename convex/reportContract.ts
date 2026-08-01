import { v } from "convex/values";

export const EVIDENCE_CLASSIFICATIONS = [
  "verified_source",
  "customer_stated",
  "estimate",
  "scenario",
  "unknown",
] as const;

export type EvidenceClassification = (typeof EVIDENCE_CLASSIFICATIONS)[number];
export type VisualizationType = "comparison" | "bar" | "journey" | "funnel";
export type VisualizationDataKind = EvidenceClassification | "qualitative";
export type ConceptLayout = "split" | "stack" | "feature_grid" | "editorial";

export type LegacyConceptPreview = {
  id: string;
  name: string;
  artDirection: string;
  blurb: string;
  bodyHtml: string;
  bodyCss: string;
};

export type LegacyPricingTier = {
  id: string;
  name: string;
  tagline: string;
  recommended: boolean;
  website: string;
  receptionist: string;
  extraMinutes: string;
  maintenance?: string;
  notes?: string;
};

export type LegacyReportContent = {
  companyName: string;
  contactName?: string;
  title: string;
  introduction: string;
  observations: string[];
  recommendation: {
    summary: string;
    website: string;
    receptionist: string;
    pricing: string;
  };
  nextSteps: string[];
  neededFromCustomer: string[];
  disclaimer?: string;
  theme?: { accent?: string; tone?: "neutral" | "warm" | "technical" };
  highlights?: string[];
  situation?: { headline: string; body: string };
  comparison?: { before: string[]; after: string[] };
  valueFlow?: { stage: string; description: string }[];
  conceptPreviews?: LegacyConceptPreview[];
  pricingOverview?: { tiers: LegacyPricingTier[]; vatNote: string };
};

export type EvidenceLedgerEntry = {
  id: string;
  claim: string;
  classification: EvidenceClassification;
  sourceLabel: string;
  sourceUrl?: string;
  asOf?: string;
  explanation: string;
};

export type CompanyProfile = {
  companyName: string;
  contactName?: string;
  industry: string;
  location: string;
  audience: string;
  services: string[];
  currentDigitalPresence: string[];
  brandTraits: string[];
};

export type SituationGap = {
  title: string;
  description: string;
  evidenceIds: string[];
};

export type Opportunity = {
  title: string;
  mechanism: string;
  potentialImpact: string;
  evidenceIds: string[];
  recommendedAction: string;
};

export type VisualizationData = {
  label: string;
  value?: number;
  displayValue: string;
  kind: VisualizationDataKind;
};

export type Visualization = {
  type: VisualizationType;
  title: string;
  description: string;
  evidenceIds: string[];
  data: VisualizationData[];
};

export type JourneyStage = {
  stage: string;
  currentExperience: string;
  futureExperience: string;
  evidenceIds: string[];
};

export type ConceptPalette = {
  background: string;
  surface: string;
  text: string;
  accent: string;
  muted: string;
  onAccent: string;
};

export type ConceptPreview = {
  id: string;
  name: string;
  artDirection: string;
  rationale: string;
  tradeoffs: string[];
  palette: ConceptPalette;
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
  };
  sections: { heading: string; body: string; layout: ConceptLayout }[];
  proofItems: { label: string; value: string; evidenceIds: string[] }[];
  mobile: { navigation: string; primaryAction: string };
};

export type OfferPrice = {
  amount: number;
  currency: string;
  display: string;
};

export type OfferComponent = {
  service: string;
  tier: string;
  oneTimePrice: OfferPrice | null;
  monthlyPrice: OfferPrice | null;
  includedItems: string[];
};

export type OfferAssumption = {
  text: string;
  classification: "estimate" | "scenario" | "unknown";
  evidenceIds: string[];
};

export type OfferAlternative = OfferComponent & { rationale: string };

export type RecommendedOffer = {
  rationale: string;
  components: OfferComponent[];
  oneTimeTotal: OfferPrice;
  recurringMonthlyTotal: OfferPrice;
  assumptions: OfferAssumption[];
  optionalAddOns: OfferComponent[];
  alternatives: OfferAlternative[];
};

export type PersonalReportV2Content = {
  kind: "personal_report_v2";
  schemaVersion: 2;
  companyProfile: CompanyProfile;
  evidenceLedger: EvidenceLedgerEntry[];
  currentSituation: { summary: string; gaps: SituationGap[] };
  opportunities: Opportunity[];
  visualizations: Visualization[];
  customerJourney: JourneyStage[];
  conceptPreviews: ConceptPreview[];
  recommendedOffer: RecommendedOffer;
  nextSteps: string[];
  neededFromCustomer: string[];
  disclaimer: string;
  theme: { accent: string; tone: "neutral" | "warm" | "technical" };
};

export type ReportContent = LegacyReportContent | PersonalReportV2Content;

export type ResolvedReport = {
  content: ReportContent;
  expiresAt?: number;
  updatedAt: number;
};

const evidenceClassificationValidator = v.union(
  v.literal("verified_source"),
  v.literal("customer_stated"),
  v.literal("estimate"),
  v.literal("scenario"),
  v.literal("unknown"),
);

const legacyConceptPreviewValidator = v.object({
  id: v.string(),
  name: v.string(),
  artDirection: v.string(),
  blurb: v.string(),
  bodyHtml: v.string(),
  bodyCss: v.string(),
});

const legacyPricingTierValidator = v.object({
  id: v.string(),
  name: v.string(),
  tagline: v.string(),
  recommended: v.boolean(),
  website: v.string(),
  receptionist: v.string(),
  extraMinutes: v.string(),
  maintenance: v.optional(v.string()),
  notes: v.optional(v.string()),
});

export const legacyReportContentValidator = v.object({
  companyName: v.string(),
  contactName: v.optional(v.string()),
  title: v.string(),
  introduction: v.string(),
  observations: v.array(v.string()),
  recommendation: v.object({
    summary: v.string(),
    website: v.string(),
    receptionist: v.string(),
    pricing: v.string(),
  }),
  nextSteps: v.array(v.string()),
  neededFromCustomer: v.array(v.string()),
  disclaimer: v.optional(v.string()),
  theme: v.optional(v.object({
    accent: v.optional(v.string()),
    tone: v.optional(v.union(v.literal("neutral"), v.literal("warm"), v.literal("technical"))),
  })),
  highlights: v.optional(v.array(v.string())),
  situation: v.optional(v.object({ headline: v.string(), body: v.string() })),
  comparison: v.optional(v.object({ before: v.array(v.string()), after: v.array(v.string()) })),
  valueFlow: v.optional(v.array(v.object({ stage: v.string(), description: v.string() }))),
  conceptPreviews: v.optional(v.array(legacyConceptPreviewValidator)),
  pricingOverview: v.optional(v.object({ tiers: v.array(legacyPricingTierValidator), vatNote: v.string() })),
});

const priceValidator = v.object({ amount: v.number(), currency: v.string(), display: v.string() });
const offerComponentValidator = v.object({
  service: v.string(),
  tier: v.string(),
  oneTimePrice: v.union(priceValidator, v.null()),
  monthlyPrice: v.union(priceValidator, v.null()),
  includedItems: v.array(v.string()),
});
const offerAssumptionValidator = v.object({
  text: v.string(),
  classification: v.union(v.literal("estimate"), v.literal("scenario"), v.literal("unknown")),
  evidenceIds: v.array(v.string()),
});
const offerAlternativeValidator = v.object({
  service: v.string(),
  tier: v.string(),
  oneTimePrice: v.union(priceValidator, v.null()),
  monthlyPrice: v.union(priceValidator, v.null()),
  includedItems: v.array(v.string()),
  rationale: v.string(),
});

export const personalReportV2ContentValidator = v.object({
  kind: v.literal("personal_report_v2"),
  schemaVersion: v.literal(2),
  companyProfile: v.object({
    companyName: v.string(),
    contactName: v.optional(v.string()),
    industry: v.string(),
    location: v.string(),
    audience: v.string(),
    services: v.array(v.string()),
    currentDigitalPresence: v.array(v.string()),
    brandTraits: v.array(v.string()),
  }),
  evidenceLedger: v.array(v.object({
    id: v.string(),
    claim: v.string(),
    classification: evidenceClassificationValidator,
    sourceLabel: v.string(),
    sourceUrl: v.optional(v.string()),
    asOf: v.optional(v.string()),
    explanation: v.string(),
  })),
  currentSituation: v.object({
    summary: v.string(),
    gaps: v.array(v.object({ title: v.string(), description: v.string(), evidenceIds: v.array(v.string()) })),
  }),
  opportunities: v.array(v.object({
    title: v.string(),
    mechanism: v.string(),
    potentialImpact: v.string(),
    evidenceIds: v.array(v.string()),
    recommendedAction: v.string(),
  })),
  visualizations: v.array(v.object({
    type: v.union(v.literal("comparison"), v.literal("bar"), v.literal("journey"), v.literal("funnel")),
    title: v.string(),
    description: v.string(),
    evidenceIds: v.array(v.string()),
    data: v.array(v.object({
      label: v.string(),
      value: v.optional(v.number()),
      displayValue: v.string(),
      kind: v.union(evidenceClassificationValidator, v.literal("qualitative")),
    })),
  })),
  customerJourney: v.array(v.object({
    stage: v.string(),
    currentExperience: v.string(),
    futureExperience: v.string(),
    evidenceIds: v.array(v.string()),
  })),
  conceptPreviews: v.array(v.object({
    id: v.string(),
    name: v.string(),
    artDirection: v.string(),
    rationale: v.string(),
    tradeoffs: v.array(v.string()),
    palette: v.object({
      background: v.string(), surface: v.string(), text: v.string(), accent: v.string(), muted: v.string(), onAccent: v.string(),
    }),
    hero: v.object({
      eyebrow: v.string(), headline: v.string(), subheadline: v.string(), primaryCta: v.string(), secondaryCta: v.string(),
    }),
    sections: v.array(v.object({
      heading: v.string(), body: v.string(),
      layout: v.union(v.literal("split"), v.literal("stack"), v.literal("feature_grid"), v.literal("editorial")),
    })),
    proofItems: v.array(v.object({ label: v.string(), value: v.string(), evidenceIds: v.array(v.string()) })),
    mobile: v.object({ navigation: v.string(), primaryAction: v.string() }),
  })),
  recommendedOffer: v.object({
    rationale: v.string(),
    components: v.array(offerComponentValidator),
    oneTimeTotal: priceValidator,
    recurringMonthlyTotal: priceValidator,
    assumptions: v.array(offerAssumptionValidator),
    optionalAddOns: v.array(offerComponentValidator),
    alternatives: v.array(offerAlternativeValidator),
  }),
  nextSteps: v.array(v.string()),
  neededFromCustomer: v.array(v.string()),
  disclaimer: v.string(),
  theme: v.object({
    accent: v.string(),
    tone: v.union(v.literal("neutral"), v.literal("warm"), v.literal("technical")),
  }),
});

export const reportContentValidator = v.union(legacyReportContentValidator, personalReportV2ContentValidator);

type RecordValue = Record<string, unknown>;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const HTTP_URL = /^https?:\/\/[^\s]+$/i;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(nonEmpty);
}

function add(errors: string[], condition: boolean, message: string): void {
  if (!condition) errors.push(message);
}

function validateEvidenceRefs(value: unknown, evidenceIds: Set<string>, errors: string[], path: string): void {
  add(errors, stringArray(value), `${path} must contain non-empty evidence IDs`);
  if (Array.isArray(value)) {
    value.forEach((id) => add(errors, evidenceIds.has(id), `${path} references unknown evidence ID: ${String(id)}`));
  }
}

function validatePrice(value: unknown, errors: string[], path: string, nullable = false): void {
  if (value === null && nullable) return;
  if (!isRecord(value)) {
    errors.push(`${path} must be a price object`);
    return;
  }
  add(errors, typeof value.amount === "number" && Number.isFinite(value.amount) && value.amount >= 0, `${path}.amount must be non-negative`);
  add(errors, nonEmpty(value.currency), `${path}.currency is required`);
  add(errors, nonEmpty(value.display), `${path}.display is required`);
}

function validateConcept(value: unknown, evidenceIds: Set<string>, errors: string[], path: string): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  for (const field of ["id", "name", "artDirection", "rationale"]) add(errors, nonEmpty(value[field]), `${path}.${field} is required`);
  add(errors, stringArray(value.tradeoffs), `${path}.tradeoffs must contain meaningful items`);
  const palette = value.palette;
  if (!isRecord(palette)) errors.push(`${path}.palette is required`);
  else for (const field of ["background", "surface", "text", "accent", "muted", "onAccent"]) add(errors, nonEmpty(palette[field]) && HEX_COLOR.test(palette[field]), `${path}.palette.${field} must be a safe #RRGGBB color`);
  const hero = value.hero;
  if (!isRecord(hero)) errors.push(`${path}.hero is required`);
  else for (const field of ["eyebrow", "headline", "subheadline", "primaryCta", "secondaryCta"]) add(errors, nonEmpty(hero[field]), `${path}.hero.${field} is required`);
  add(errors, Array.isArray(value.sections) && value.sections.length >= 3, `${path}.sections must contain at least three semantic sections`);
  if (Array.isArray(value.sections)) value.sections.forEach((section, index) => {
    if (!isRecord(section)) errors.push(`${path}.sections[${index}] must be an object`);
    else {
      for (const field of ["heading", "body", "layout"]) add(errors, nonEmpty(section[field]), `${path}.sections[${index}].${field} is required`);
      add(errors, ["split", "stack", "feature_grid", "editorial"].includes(String(section.layout)), `${path}.sections[${index}].layout is invalid`);
    }
  });
  add(errors, Array.isArray(value.proofItems) && value.proofItems.length > 0, `${path}.proofItems must not be empty`);
  if (Array.isArray(value.proofItems)) value.proofItems.forEach((proof, index) => {
    if (!isRecord(proof)) errors.push(`${path}.proofItems[${index}] must be an object`);
    else {
      add(errors, nonEmpty(proof.label), `${path}.proofItems[${index}].label is required`);
      add(errors, nonEmpty(proof.value), `${path}.proofItems[${index}].value is required`);
      validateEvidenceRefs(proof.evidenceIds, evidenceIds, errors, `${path}.proofItems[${index}].evidenceIds`);
    }
  });
  if (!isRecord(value.mobile)) errors.push(`${path}.mobile is required`);
  else {
    add(errors, nonEmpty(value.mobile.navigation), `${path}.mobile.navigation is required`);
    add(errors, nonEmpty(value.mobile.primaryAction), `${path}.mobile.primaryAction is required`);
  }
  const serialised = JSON.stringify(value);
  add(errors, !/<script\b|javascript:|on[a-z]+\s*=/i.test(serialised), `${path} contains unsafe executable markup`);
}

export function validateReportContent(value: unknown): string[] {
  if (!isRecord(value)) return ["content must be an object"];
  if (value.schemaVersion !== 2) return [];
  const errors: string[] = [];
  add(errors, value.kind === "personal_report_v2", "kind must be personal_report_v2");
  const company = value.companyProfile;
  if (!isRecord(company)) errors.push("companyProfile is required");
  else {
    for (const field of ["companyName", "industry", "location", "audience"]) add(errors, nonEmpty(company[field]), `companyProfile.${field} is required`);
    for (const field of ["services", "currentDigitalPresence", "brandTraits"]) add(errors, stringArray(company[field]), `companyProfile.${field} must contain meaningful items`);
  }
  const entries = value.evidenceLedger;
  const evidenceIds = new Set<string>();
  if (!Array.isArray(entries) || entries.length < 3) errors.push("evidenceLedger must contain at least three entries");
  else entries.forEach((entry, index) => {
    if (!isRecord(entry)) { errors.push(`evidenceLedger[${index}] must be an object`); return; }
    for (const field of ["id", "claim", "sourceLabel", "explanation"]) add(errors, nonEmpty(entry[field]), `evidenceLedger[${index}].${field} is required`);
    if (entry.sourceUrl !== undefined) add(errors, typeof entry.sourceUrl === "string" && HTTP_URL.test(entry.sourceUrl), `evidenceLedger[${index}].sourceUrl must use http or https`);
    if (nonEmpty(entry.id)) {
      add(errors, !evidenceIds.has(entry.id), `duplicate evidence ID: ${entry.id}`);
      evidenceIds.add(entry.id);
    }
    add(errors, EVIDENCE_CLASSIFICATIONS.includes(entry.classification as EvidenceClassification), `evidenceLedger[${index}].classification is invalid`);
    if (entry.classification === "estimate" || entry.classification === "scenario") add(errors, nonEmpty(entry.explanation), `evidenceLedger[${index}].explanation is required for estimates and scenarios`);
  });
  const situation = value.currentSituation;
  if (!isRecord(situation)) errors.push("currentSituation is required");
  else {
    add(errors, nonEmpty(situation.summary), "currentSituation.summary is required");
    add(errors, Array.isArray(situation.gaps) && situation.gaps.length > 0, "currentSituation.gaps must not be empty");
    if (Array.isArray(situation.gaps)) situation.gaps.forEach((gap, index) => {
      if (!isRecord(gap)) errors.push(`currentSituation.gaps[${index}] must be an object`);
      else {
        for (const field of ["title", "description"]) add(errors, nonEmpty(gap[field]), `currentSituation.gaps[${index}].${field} is required`);
        validateEvidenceRefs(gap.evidenceIds, evidenceIds, errors, `currentSituation.gaps[${index}].evidenceIds`);
      }
    });
  }
  if (!Array.isArray(value.opportunities) || value.opportunities.length < 3) errors.push("opportunities must contain at least three concrete items");
  else value.opportunities.forEach((opportunity, index) => {
    if (!isRecord(opportunity)) errors.push(`opportunities[${index}] must be an object`);
    else {
      for (const field of ["title", "mechanism", "potentialImpact", "recommendedAction"]) add(errors, nonEmpty(opportunity[field]), `opportunities[${index}].${field} is required`);
      validateEvidenceRefs(opportunity.evidenceIds, evidenceIds, errors, `opportunities[${index}].evidenceIds`);
    }
  });
  if (!Array.isArray(value.visualizations) || value.visualizations.length < 1) errors.push("visualizations must contain at least one meaningful item");
  else value.visualizations.forEach((visualization, index) => {
    if (!isRecord(visualization)) errors.push(`visualizations[${index}] must be an object`);
    else {
      for (const field of ["type", "title", "description"]) add(errors, nonEmpty(visualization[field]), `visualizations[${index}].${field} is required`);
      add(errors, ["comparison", "bar", "journey", "funnel"].includes(String(visualization.type)), `visualizations[${index}].type is invalid`);
      validateEvidenceRefs(visualization.evidenceIds, evidenceIds, errors, `visualizations[${index}].evidenceIds`);
      add(errors, Array.isArray(visualization.data) && visualization.data.length >= 2, `visualizations[${index}].data must contain at least two items`);
      if (Array.isArray(visualization.data)) visualization.data.forEach((datum, datumIndex) => {
        if (!isRecord(datum)) errors.push(`visualizations[${index}].data[${datumIndex}] must be an object`);
        else {
          for (const field of ["label", "displayValue", "kind"]) add(errors, nonEmpty(datum[field]), `visualizations[${index}].data[${datumIndex}].${field} is required`);
          if (datum.value !== undefined) add(errors, typeof datum.value === "number" && Number.isFinite(datum.value), `visualizations[${index}].data[${datumIndex}].value must be numeric`);
          add(errors, [...EVIDENCE_CLASSIFICATIONS, "qualitative"].includes(String(datum.kind)), `visualizations[${index}].data[${datumIndex}].kind is invalid`);
        }
      });
    }
  });
  if (!Array.isArray(value.customerJourney) || value.customerJourney.length < 3) errors.push("customerJourney must contain at least three stages");
  else value.customerJourney.forEach((stage, index) => {
    if (!isRecord(stage)) errors.push(`customerJourney[${index}] must be an object`);
    else {
      for (const field of ["stage", "currentExperience", "futureExperience"]) add(errors, nonEmpty(stage[field]), `customerJourney[${index}].${field} is required`);
      validateEvidenceRefs(stage.evidenceIds, evidenceIds, errors, `customerJourney[${index}].evidenceIds`);
    }
  });
  if (!Array.isArray(value.conceptPreviews) || value.conceptPreviews.length !== 3) errors.push("conceptPreviews must contain exactly three concepts");
  else {
    const conceptIds = new Set<string>();
    const artDirections = new Set<string>();
    const rationales = new Set<string>();
    const ctas = new Set<string>();
    const tradeoffs = new Set<string>();
    value.conceptPreviews.forEach((concept, index) => {
      validateConcept(concept, evidenceIds, errors, `conceptPreviews[${index}]`);
      if (isRecord(concept) && nonEmpty(concept.id)) {
        add(errors, !conceptIds.has(concept.id), `duplicate concept ID: ${concept.id}`);
        conceptIds.add(concept.id);
        artDirections.add(String(concept.artDirection).trim().toLocaleLowerCase("sv"));
        rationales.add(String(concept.rationale).trim().toLocaleLowerCase("sv"));
        tradeoffs.add(Array.isArray(concept.tradeoffs) ? concept.tradeoffs.join("|").trim().toLocaleLowerCase("sv") : "");
        if (isRecord(concept.hero)) ctas.add(`${String(concept.hero.primaryCta)}|${String(concept.hero.secondaryCta)}`.trim().toLocaleLowerCase("sv"));
      }
    });
    add(errors, artDirections.size === 3, "concepts must have three distinct art directions");
    add(errors, rationales.size === 3, "concepts must have three distinct rationales");
    add(errors, ctas.size === 3, "concepts must have three distinct CTA pairs");
    add(errors, tradeoffs.size === 3, "concepts must have three distinct trade-off sets");
  }
  const offer = value.recommendedOffer;
  if (!isRecord(offer)) errors.push("recommendedOffer is required");
  else {
    add(errors, nonEmpty(offer.rationale), "recommendedOffer.rationale is required");
    add(errors, Array.isArray(offer.components) && offer.components.length > 0, "recommendedOffer.components must not be empty");
    for (const priceField of ["oneTimeTotal", "recurringMonthlyTotal"]) validatePrice(offer[priceField], errors, `recommendedOffer.${priceField}`);
    for (const componentField of ["components", "optionalAddOns", "alternatives"]) {
      add(errors, Array.isArray(offer[componentField]), `recommendedOffer.${componentField} must be an array`);
      if (Array.isArray(offer[componentField])) offer[componentField].forEach((component, index) => {
        if (!isRecord(component)) errors.push(`recommendedOffer.${componentField}[${index}] must be an object`);
        else {
          for (const field of ["service", "tier"]) add(errors, nonEmpty(component[field]), `recommendedOffer.${componentField}[${index}].${field} is required`);
          validatePrice(component.oneTimePrice, errors, `recommendedOffer.${componentField}[${index}].oneTimePrice`, true);
          validatePrice(component.monthlyPrice, errors, `recommendedOffer.${componentField}[${index}].monthlyPrice`, true);
          add(errors, stringArray(component.includedItems), `recommendedOffer.${componentField}[${index}].includedItems must contain meaningful items`);
          if (componentField === "alternatives") add(errors, nonEmpty(component.rationale), `recommendedOffer.alternatives[${index}].rationale is required`);
        }
      });
    }
    add(errors, Array.isArray(offer.assumptions), "recommendedOffer.assumptions must be an array");
    if (Array.isArray(offer.assumptions)) offer.assumptions.forEach((assumption, index) => {
      if (!isRecord(assumption)) errors.push(`recommendedOffer.assumptions[${index}] must be an object`);
      else {
        add(errors, nonEmpty(assumption.text), `recommendedOffer.assumptions[${index}].text is required`);
        add(errors, ["estimate", "scenario", "unknown"].includes(String(assumption.classification)), `recommendedOffer.assumptions[${index}].classification is invalid`);
        validateEvidenceRefs(assumption.evidenceIds, evidenceIds, errors, `recommendedOffer.assumptions[${index}].evidenceIds`);
      }
    });
    if (Array.isArray(offer.components)) {
      const oneTimeTotal = offer.components.reduce((sum, component) => {
        if (!isRecord(component) || !isRecord(component.oneTimePrice) || typeof component.oneTimePrice.amount !== "number") return sum;
        return sum + component.oneTimePrice.amount;
      }, 0);
      const recurringTotal = offer.components.reduce((sum, component) => {
        if (!isRecord(component) || !isRecord(component.monthlyPrice) || typeof component.monthlyPrice.amount !== "number") return sum;
        return sum + component.monthlyPrice.amount;
      }, 0);
      if (isRecord(offer.oneTimeTotal)) add(errors, offer.oneTimeTotal.amount === oneTimeTotal, "recommendedOffer.oneTimeTotal must equal the component total");
      if (isRecord(offer.recurringMonthlyTotal)) add(errors, offer.recurringMonthlyTotal.amount === recurringTotal, "recommendedOffer.recurringMonthlyTotal must equal the component total");
    }
  }
  for (const field of ["nextSteps", "neededFromCustomer"]) add(errors, stringArray(value[field]), `${field} must contain meaningful items`);
  add(errors, nonEmpty(value.disclaimer), "disclaimer is required");
  if (!isRecord(value.theme)) errors.push("theme is required");
  else {
    add(errors, nonEmpty(value.theme.accent) && HEX_COLOR.test(value.theme.accent), "theme.accent must be a safe #RRGGBB color");
    add(errors, ["neutral", "warm", "technical"].includes(String(value.theme.tone)), "theme.tone is invalid");
  }
  return errors;
}

export function isPersonalReportV2Content(value: unknown): value is PersonalReportV2Content {
  return isRecord(value) && value.schemaVersion === 2 && validateReportContent(value).length === 0;
}

function isLegacyReportContent(value: unknown): value is LegacyReportContent {
  if (!isRecord(value) || !nonEmpty(value.companyName) || !nonEmpty(value.title) || !nonEmpty(value.introduction)) return false;
  if (!stringArray(value.observations) || !stringArray(value.nextSteps) || !stringArray(value.neededFromCustomer)) return false;
  const recommendation = value.recommendation;
  if (!isRecord(recommendation)) return false;
  return ["summary", "website", "receptionist", "pricing"].every((field) => nonEmpty(recommendation[field]));
}

export function isReportContent(value: unknown): value is ReportContent {
  return isPersonalReportV2Content(value) || (isRecord(value) && value.schemaVersion !== 2 && isLegacyReportContent(value));
}

export function parseResolvedReport(value: unknown): ResolvedReport | null {
  if (!isRecord(value) || !isReportContent(value.content) || typeof value.updatedAt !== "number") return null;
  if (value.expiresAt !== undefined && typeof value.expiresAt !== "number") return null;
  return {
    content: value.content,
    expiresAt: value.expiresAt,
    updatedAt: value.updatedAt,
  };
}
