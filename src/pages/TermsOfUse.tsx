import React from "react";

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

export default function TermsOfUse({ Header, Footer }: Props) {
  const pretty = formatBuildDate(isoBuildTime);

  return (
    <div className="min-h-screen bg-[var(--crt-bg,#050605)] text-[var(--crt-text,#c7f3d2)]">
      {Header ?? (
        <header className="border-b border-[var(--crt-border,#1c1f22)]/80 sticky top-0 z-20 bg-[var(--crt-bg,#050605)]/75 backdrop-blur">
          <div className="max-w-[880px] mx-auto px-6 py-4 flex items-center justify-between">
            <a
              href="/"
              className="text-sm tracking-wide text-[var(--crt-muted,#7aa789)] hover:text-[var(--crt-accent,#39f3a3)] transition"
            >
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
          Terms of Use — Settle
        </h1>
        <p className="mt-1 text-[var(--crt-muted,#7aa789)]">
          Settle is a non-custodial web interface to smart contracts on Base using x402.
        </p>

        {/** ---- Sections ---- */}
        <Section id="acceptance" title="1) Acceptance">
          <p>
            By accessing or using <strong>Settle</strong> (the “Service”)—including connecting a wallet, minting,
            or transacting via the x402 protocol on Base—you agree to these Terms. If you do not agree, do not
            use the Service.
          </p>
        </Section>

        <Section id="what-settle-is" title="2) What Settle Is">
          <p>
            Settle is a web interface to smart contracts that enable gas-sponsored (“gasless”) transactions using{" "}
            <strong>x402</strong> on <strong>Base</strong>. Settle is <strong>non-custodial</strong>: we do not hold
            or control user assets or keys. On-chain actions occur via smart contracts you choose to interact with.
          </p>
        </Section>

        <Section id="eligibility" title="3) Eligibility">
          <p>
            You must be at least 18 and not subject to sanctions or other prohibitions under applicable laws. You
            are responsible for ensuring the Service is legal where you use it.
          </p>
        </Section>

        <Section id="wallets" title="4) Wallets & Security">
          <p>
            You use third-party wallets (e.g., MetaMask, Coinbase Wallet) at your own risk. Protect your seed phrase
            and private keys. We cannot recover keys, reverse transactions, or freeze funds.
          </p>
        </Section>

        <Section id="fees" title="5) Fees, Sponsorship & Limits">
          <p>
            Transactions may be gas-sponsored via x402 subject to availability, quotas, and risk controls. We may
            throttle, deny, or revoke sponsorship at any time. Network or third-party fees may still apply. Prices
            and limits can change without notice.
          </p>
        </Section>

        <Section id="token" title="6) Token Disclosures — $SETTLE">
          <p>
            Interacting with <strong>$SETTLE</strong> may involve volatility and loss of value.{" "}
            <strong>$SETTLE does not represent equity, profit rights, or claims on revenues</strong> and confers no
            governance or other rights unless explicitly stated in official documentation. Nothing here is
            investment, legal, or tax advice.
          </p>
        </Section>

        <Section id="sale" title="7) Token Sale / Pre-Sale (Mint)">
          <ul className="list-disc pl-6 space-y-1">
            <li>All Mint transactions are final once confirmed on-chain.</li>
            <li>
              Pending $SETTLE balance is informational only; final distribution is defined by the smart contract.
            </li>
            <li>
              Contracts may include hard caps, pro-rata rules, refunds, and regional restrictions per compliance
              requirements.
            </li>
            <li>
              Participation is not an investment solicitation. Verify all contract addresses on Base before
              interacting.
            </li>
          </ul>
          <div className="mt-3 rounded-xl border border-[var(--crt-border,#1c1f22)] p-4 bg-[var(--crt-panel,#0b0c0d)]/80">
            <strong>Sale Parameters (example)</strong>
            <ul className="list-disc pl-6 mt-1 space-y-0.5 text-[var(--crt-muted,#7aa789)]">
              <li>Accepted asset: USDC (Base)</li>
              <li>Start/End: TBA</li>
              <li>Hard cap: TBA</li>
              <li>Allocation rule: Pro-rata if oversubscribed</li>
            </ul>
          </div>
        </Section>

        <Section id="prohibited" title="8) Prohibited Uses">
          <p>
            No illegal activity, sanctions evasion, fraud, market manipulation, malware/spam, or interference with
            the Service. Do not violate IP, privacy, or other rights.
          </p>
        </Section>

        <Section id="third-party" title="9) Third-Party Services">
          <p>
            Integrations and links (explorers, status pages, wallets, x402 docs) are provided “as is.” We are not
            responsible for third-party content, security, or policies.
          </p>
        </Section>

        <Section id="ip" title="10) Intellectual Property">
          <p>
            The Service, brand, and site content are owned by us or our licensors and licensed to you on a limited,
            revocable basis to use the Service for its intended purpose.
          </p>
        </Section>

        <Section id="changes-beta" title="11) Changes; Beta">
          <p>
            Features may change or be discontinued at any time. Beta features may be unstable and are provided
            without commitments.
          </p>
        </Section>

        <Section id="disclaimers" title="12) Disclaimers; Limitation of Liability">
          <p>
            THE SERVICE IS PROVIDED <strong>“AS IS” AND “AS AVAILABLE”</strong> WITHOUT WARRANTIES. TO THE MAXIMUM
            EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.
            OUR TOTAL LIABILITY WILL NOT EXCEED USD $100 OR THE AMOUNT YOU PAID US IN THE 3 MONTHS BEFORE THE CLAIM.
          </p>
        </Section>

        <Section id="indemnity" title="13) Indemnity">
          <p>
            You agree to defend, indemnify, and hold us harmless from claims and costs arising from your use of the
            Service or violation of these Terms.
          </p>
        </Section>

        <Section id="arbitration" title="14) Binding Arbitration (Delaware-Seated)">
          <p>
            Any dispute will be resolved exclusively by final and binding arbitration administered by{" "}
            <strong>JAMS</strong> under its rules, seated in Wilmington, Delaware, USA. You waive jury and
            class-action rights. Opt-out within 30 days by emailing{" "}
            <a href="mailto:info@settleonbase.xyz" className="underline text-[var(--crt-accent,#39f3a3)]">
              info@settleonbase.xyz
            </a>
            .
          </p>
        </Section>

        <Section id="changes" title="15) Changes to Terms">
          <p>We may update these Terms by posting a revised version with a new “Last updated” date.</p>
        </Section>

        <Section id="contact" title="16) Contact">
          <p>
            Questions:{" "}
            <a
              href="mailto:info@settleonbase.xyz"
              className="underline decoration-dotted text-[var(--crt-accent,#39f3a3)] hover:opacity-90"
            >
              info@settleonbase.xyz
            </a>
          </p>
        </Section>

        <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-[var(--crt-border,#1c1f22)] to-transparent" />

        <Section id="annex" title="Annex — Contracts on Base">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Primary contract:</strong>{" "}
              <code className="align-middle">0x20c84933F3fFAcFF1C0b4D713b059377a9EF5fD1</code>
            </li>
            <li>
              <strong>Symbol:</strong> <code className="align-middle">$SETTLE</code>
            </li>
          </ul>
          <p className="mt-2 text-[var(--crt-muted,#7aa789)]">
            Always verify contract addresses and permissions before signing.
          </p>
        </Section>
      </main>

      {Footer ?? (
        <footer className="border-t border-[var(--crt-border,#1c1f22)] text-[var(--crt-muted,#7aa789)] text-sm">
          <div className="max-w-[880px] mx-auto px-6 py-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© 2025 Settle</span>
            <a href="/privacy" className="hover:text-[var(--crt-accent,#39f3a3)]">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[var(--crt-accent,#39f3a3)]">
              Terms
            </a>
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
