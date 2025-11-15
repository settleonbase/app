import React from "react";

/**
 * PrivacyPolicy — Settle
 * - Tailwind/CRT dark style aligned with the app
 * - "Last updated" auto-injected from build time via VITE_BUILD_TIME
 * - Pluggable header/footer: pass your site components via props
 *
 * Usage:
 *   <PrivacyPolicy Header={<SiteHeader/>} Footer={<SiteFooter/>} />
 */

type Props = {
  Header?: React.ReactNode;
  Footer?: React.ReactNode;
};

const isoBuildTime = (import.meta as any).env?.VITE_BUILD_TIME || new Date().toISOString();

function formatBuildDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export default function PrivacyPolicy({ Header, Footer }: Props) {
  const pretty = formatBuildDate(isoBuildTime);

  return (
    <div className="min-h-screen bg-[var(--crt-bg,#050605)] text-[var(--crt-text,#c7f3d2)]">
      {/* Header slot (same as homepage) */}
      {Header ?? (
        <header className="border-b border-[var(--crt-border,#1c1f22)]/80 sticky top-0 z-20 bg-[var(--crt-bg,#050605)]/75 backdrop-blur">
          <div className="max-w-[880px] mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-sm tracking-wide text-[var(--crt-muted,#7aa789)] hover:text-[var(--crt-accent,#39f3a3)] transition">
              ← Back to Home
            </a>
            <div className="text-xs text-[var(--crt-muted,#7aa789)]">Settle</div>
          </div>
        </header>
      )}

      <main className="max-w-[880px] mx-auto px-6 pb-16">
        <div className="pt-10" />
        <div className="flex items-center gap-2 text-[13px] text-[var(--crt-muted,#7aa789)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--crt-accent,#39f3a3)] shadow-[0_0_10px_var(--crt-accent,#39f3a3)]" />
          <span>
            Last updated: <time dateTime={isoBuildTime}>{pretty}</time>
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight drop-shadow-[0_0_6px_rgba(57,243,163,.35)]">
          Privacy Policy — Settle
        </h1>
        <p className="mt-1 text-[var(--crt-muted,#7aa789)]">
          We practice data minimization. Settle is a non-custodial interface; most activity occurs on public
          blockchains.
        </p>

        {/* Sections */}
        <Section id="overview" title="1) Overview">
          <p>This Policy explains what we collect, why, and your choices.</p>
        </Section>

        <Section id="data-we-collect" title="2) Data We Collect">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>On-chain data:</strong> public wallet addresses, transaction hashes, contract interactions (public by
              design).
            </li>
            <li>
              <strong>Technical data:</strong> IP address, device/browser info, timestamps, and basic event/error logs needed to
              operate the Service, secure sponsorship, and prevent abuse.
            </li>
            <li>
              <strong>Optional analytics/telemetry (if enabled):</strong> aggregated usage metrics (e.g., page views, error rates).
              We do not use this to build personal profiles.
            </li>
            <li>
              <strong>Support communications:</strong> information you provide when you contact us.
            </li>
            <li>
              <strong>Sale/Mint data:</strong> on-chain contribution data and minimal technical logs necessary to compute pending
              entitlements, enforce caps, and execute distribution.
            </li>
          </ul>
          <p className="mt-2">
            <strong>We do not collect seed phrases or private keys</strong>, and we do not take custody of funds.
          </p>
        </Section>

        <Section id="how-we-use" title="3) How We Use Data">
          <ul className="list-disc pl-6 space-y-1">
            <li>Operate and improve the Service (routing, sponsorship eligibility, performance, debugging).</li>
            <li>Prevent abuse and fraud (rate-limiting, security monitoring).</li>
            <li>Operate sales/Mints (calculate entitlements, enforce caps, distribute or refund as supported by contract).</li>
            <li>Comply with legal obligations.</li>
            <li>Respond to your inquiries.</li>
          </ul>
        </Section>

        <Section id="legal-bases" title="4) Legal Bases (if applicable)">
          <p>
            Legitimate interests (run a secure, reliable interface), contract (provide requested features), consent (for
            non-essential cookies/analytics), and legal obligations.
          </p>
        </Section>

        <Section id="sharing" title="5) Sharing">
          <p>
            We may share limited data with service providers (hosting/CDN, analytics, error logging) under confidentiality
            and data-processing terms; with authorities when required by law; or in connection with a business transfer. We
            do <strong>not</strong> sell personal data.
          </p>
        </Section>

        <Section id="transfers" title="6) International Transfers">
          <p>
            Your data may be processed outside your country. Where required, we use appropriate safeguards (e.g., standard
            contractual clauses).
          </p>
        </Section>

        <Section id="retention" title="7) Retention">
          <p>
            We retain data only as long as necessary for the purposes above—typically short operational windows for logs
            unless longer retention is needed for security, aggregated analytics, or legal reasons.
          </p>
        </Section>

        <Section id="choices" title="8) Your Choices & Rights">
          <ul className="list-disc pl-6 space-y-1">
            <li>Block non-essential cookies/analytics via your browser or our cookie banner (if enabled).</li>
            <li>Contact us to access, correct, or delete personal data where applicable law provides such rights.</li>
            <li>Disconnect your wallet at any time; on-chain records are public and immutable.</li>
          </ul>
        </Section>

        <Section id="children" title="9) Children">
          <p>
            The Service is not directed to children under 13 (or older minimum age where applicable). Do not use the
            Service if you are under the applicable age.
          </p>
        </Section>

        <Section id="security" title="10) Security">
          <p>
            We use industry-standard technical and organizational measures appropriate to the nature of the data and our
            Service. No method is 100% secure.
          </p>
        </Section>

        <Section id="third-party-links" title="11) Third-Party Links">
          <p>Wallets, explorers, and external sites have their own policies. Review them before use.</p>
        </Section>

        <Section id="changes" title="12) Changes">
          <p>We may update this Policy by posting a revised version with a new “Last updated” date.</p>
        </Section>

        <Section id="contact" title="13) Contact">
          <p>
            Privacy inquiries or rights requests: {" "}
            <a
              href="mailto:info@settleonbase.xyz"
              className="underline decoration-dotted text-[var(--crt-accent,#39f3a3)] hover:opacity-90"
            >
              info@settleonbase.xyz
            </a>
          </p>
        </Section>

        <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-[var(--crt-border,#1c1f22)] to-transparent" />

        <Section id="contracts" title="Appendix — Contracts on Base (public information)">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Primary contract:</strong>{" "}
              <code className="align-middle">0x20c84933F3fFAcFF1C0b4D713b059377a9EF5fD1</code>
            </li>
            <li>
              <strong>Symbol:</strong> <code className="align-middle">$SETTLE</code>
            </li>
          </ul>
        </Section>
      </main>

      {/* Footer slot (same as homepage) */}
      {Footer ?? (
        <footer className="border-t border-[var(--crt-border,#1c1f22)] text-[var(--crt-muted,#7aa789)] text-sm">
          <div className="max-w-[880px] mx-auto px-6 py-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© 2025 Settle</span>
            <a href="/privacy" className="hover:text-[var(--crt-accent,#39f3a3)]">Privacy</a>
            <a href="/terms" className="hover:text-[var(--crt-accent,#39f3a3)]">Terms</a>
          </div>
        </footer>
      )}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="my-4 rounded-2xl border border-[var(--crt-border,#1c1f22)] bg-[var(--crt-panel,#0b0c0d)]/90 shadow-[0_0_0.5px_rgba(57,243,163,.35),0_0_18px_rgba(57,243,163,.06)]"
    >
      <div className="p-5">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <div className="text-[15px] leading-7 text-[var(--crt-text,#c7f3d2)]">{children}</div>
      </div>
    </section>
  );
}
