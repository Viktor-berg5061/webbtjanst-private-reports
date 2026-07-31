import Link from "next/link";
import { PUBLIC_WEBSITE_URL } from "@/lib/report";

export default function NotFound() {
  return (
    <main className="shell">
      <header className="rt-header">
        <span className="rt-brand">
          <span className="rt-brand-mark" aria-hidden="true">W</span>
          <span>Webbtjänst</span>
        </span>
        <span className="rt-tag">
          <span className="rt-tag-dot" aria-hidden="true" />
          Länken kunde inte visas
        </span>
      </header>

      <section className="rt-notice" aria-labelledby="not-found-title">
        <p className="rt-eyebrow">Webbtjänst</p>
        <h1 id="not-found-title">Sidan kan inte visas</h1>
        <p>
          Länken är felaktig, har gått ut eller har återkallats. Av säkerhetsskäl
          visar vi inte mer information.
        </p>
        <p>
          Kontakta oss om du behöver en ny länk — vi skickar en ny personlig
          sammanställning direkt.
        </p>
        <Link className="rt-notice-cta" href={PUBLIC_WEBSITE_URL} rel="noopener">
          Besök webbtjanst.com
        </Link>
      </section>
    </main>
  );
}
