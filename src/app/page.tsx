import Link from "next/link";
import { PUBLIC_WEBSITE_URL } from "@/lib/report";

export default function Home() {
  return (
    <main className="shell">
      <header className="rt-header">
        <span className="rt-brand">
          <span className="rt-brand-mark" aria-hidden="true">W</span>
          <span>Webbtjänst</span>
        </span>
        <span className="rt-tag">
          <span className="rt-tag-dot" aria-hidden="true" />
          Personlig sammanställning
        </span>
      </header>

      <section className="rt-notice" aria-labelledby="page-title">
        <p className="rt-eyebrow">Webbtjänst</p>
        <h1 id="page-title">Personlig sammanställning</h1>
        <p>
          En personlig sammanställning öppnas via den unika länken som skickas
          efter samtalet. Här finns ingen publik lista, inget sökfält och inga
          förutsägbara adresser.
        </p>
        <p>
          Har du fått en länk av oss? Öppna den i din webbläsare så ser du
          rekommendation, prisbild och nästa steg för ditt företag.
        </p>
        <Link className="rt-notice-cta" href={PUBLIC_WEBSITE_URL} rel="noopener">
          Besök webbtjanst.com
        </Link>
      </section>
    </main>
  );
}
