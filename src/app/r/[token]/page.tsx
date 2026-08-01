import type { CSSProperties, ReactElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isPersonalReportV2Content } from "../../../../convex/reportContract";
import type { LegacyReportContent } from "../../../../convex/reportContract";
import { PUBLIC_WEBSITE_URL, resolveReport } from "@/lib/report";
import { ReportHero } from "@/components/ReportHero";
import { Observations, Situation, DefaultSituationDiagram } from "@/components/Situation";
import { Recommendation, ValueFlow } from "@/components/Recommendation";
import { Comparison } from "@/components/Comparison";
import { PricingOverview } from "@/components/Pricing";
import { IconCheck } from "@/components/icons";
import { V2Report } from "@/components/V2Report";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Personlig sammanställning | Webbtjänst",
  robots: { index: false, follow: false, nocache: true },
};

function LegacyReport({ content }: { content: LegacyReportContent }): ReactElement {
  const observations = content.observations ?? [];
  const nextSteps = content.nextSteps ?? [];
  const neededFromCustomer = content.neededFromCustomer ?? [];
  const tiers = content.pricingOverview?.tiers;

  return <>
    <ReportHero companyName={content.companyName} contactName={content.contactName} title={content.title} introduction={content.introduction} pull={content.situation?.headline} highlights={content.highlights} />
    {content.situation ? <section className="rt-section" aria-labelledby="rt-sit"><Situation headline={content.situation.headline} body={content.situation.body} diagram={<DefaultSituationDiagram />} /></section> : null}
    {observations.length > 0 ? <section className="rt-section" aria-labelledby="rt-obs"><header className="rt-section-head"><div><p className="rt-section-eyebrow">Det vi ser</p><h2 className="rt-section-title" id="rt-obs">Det vi tar med oss från samtalet</h2></div></header><Observations items={observations} /></section> : null}
    {content.comparison ? <section className="rt-section" aria-labelledby="rt-cmp"><header className="rt-section-head"><div><p className="rt-section-eyebrow">Vad som ändras</p><h2 className="rt-section-title" id="rt-cmp">Från dagens situation till ett tydligare upplägg</h2></div></header><Comparison before={content.comparison.before} after={content.comparison.after} /></section> : null}
    <section className="rt-section" aria-labelledby="rt-reco"><header className="rt-section-head"><div><p className="rt-section-eyebrow">Rekommendation</p><h2 className="rt-section-title" id="rt-reco">Förslag utifrån underlaget</h2></div></header><Recommendation summary={content.recommendation.summary} website={content.recommendation.website} receptionist={content.recommendation.receptionist} pricing={content.recommendation.pricing} /></section>
    {content.valueFlow && content.valueFlow.length > 0 ? <section className="rt-section" aria-labelledby="rt-flow"><ValueFlow stages={content.valueFlow} /></section> : null}
    {tiers && tiers.length > 0 && content.pricingOverview ? <section className="rt-section" aria-labelledby="rt-pricing"><PricingOverview tiers={tiers} vatNote={content.pricingOverview.vatNote} /></section> : null}
    {nextSteps.length > 0 ? <section className="rt-section" aria-labelledby="rt-steps"><header className="rt-section-head"><div><p className="rt-section-eyebrow">Nästa steg</p><h2 className="rt-section-title" id="rt-steps">Så kan arbetet gå vidare</h2></div></header><ol className="rt-steps">{nextSteps.map((item) => <li className="rt-step" key={item}><span className="rt-step-num" aria-hidden="true" /><p className="rt-step-body">{item}</p></li>)}</ol></section> : null}
    {neededFromCustomer.length > 0 ? <section className="rt-section" aria-labelledby="rt-needs"><header className="rt-section-head"><div><p className="rt-section-eyebrow">Underlag</p><h2 className="rt-section-title" id="rt-needs">Vad vi behöver från er</h2></div></header><ul className="rt-needs">{neededFromCustomer.map((item) => <li className="rt-need" key={item}><span className="rt-need-check" aria-hidden="true"><IconCheck size={12} /></span><p className="rt-need-body">{item}</p></li>)}</ul></section> : null}
    {content.disclaimer ? <p className="rt-disclaimer">{content.disclaimer}</p> : null}
  </>;
}

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const report = await resolveReport(token);
  if (!report) notFound();

  const { content } = report;
  const accent = isPersonalReportV2Content(content) ? content.theme.accent : content.theme?.accent;
  const style = accent ? ({ "--rt-accent": accent, "--rt-accent-strong": accent, "--rt-accent-soft": "transparent" } as CSSProperties) : undefined;

  return <main className="shell" style={style}>
    <header className="rt-header"><a className="rt-brand" href={PUBLIC_WEBSITE_URL} rel="noopener"><span className="rt-brand-mark" aria-hidden="true">W</span><span>Webbtjänst</span></a><span className="rt-tag"><span className="rt-tag-dot" />Personlig sammanställning</span></header>
    {isPersonalReportV2Content(content) ? <V2Report content={content} /> : <LegacyReport content={content} />}
    <footer className="rt-footer"><span>Webbtjänst · personlig sammanställning</span><a href={PUBLIC_WEBSITE_URL} rel="noopener">Läs mer om Webbtjänst →</a></footer>
  </main>;
}
