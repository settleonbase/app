import React from "react"

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 pt-10 pb-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-50 text-sky-700 dark:bg-slate-900/70 dark:text-slate-200 dark:border-sky-500/40">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-500" />
            <span className="text-[11px] uppercase tracking-[0.18em]">
              Beamio
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Last updated: <span>[Month Day, Year]</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-3">
          Beamio Privacy Policy
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          This Privacy Policy explains how <strong>[Beamio, Inc.]</strong> (“Beamio”, “we”, “us”, or “our”) collects, uses, and shares
          information when you use our website at <span className="font-mono">beamio.app</span> and our related services (the “Service”).
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          By using Beamio, you agree to the practices described in this Privacy Policy.
        </p>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 pb-16 space-y-8 text-sm text-slate-700 dark:text-slate-200">
        {/* 1 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">1. What We Collect</h2>
          <p>We aim to collect only what we need to run and improve Beamio.</p>

          <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">1.1 Information you provide</h3>
          <p className="mt-1">We may collect:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Contact information</strong>: email, username/handle, or messages you send.</li>
            <li><strong>Support requests</strong>: issue details, screenshots, or logs you share.</li>
          </ul>

          <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">1.2 Information we get automatically</h3>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Usage data</strong>: pages visited, buttons clicked, time spent.</li>
            <li><strong>Device & browser data</strong>: OS, browser, device, language, approximate region.</li>
            <li>
              <strong>Wallet-related data (non-custodial)</strong>: wallet addresses, transaction hashes, networks used.  
              <div className="mt-1 text-slate-600 dark:text-slate-400">We never collect your private keys or seed phrases.</div>
            </li>
            <li><strong>Cookies</strong> and similar technologies.</li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">2. How We Use Information</h2>
          <p>We use information to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Provide, maintain, and improve the Service;</li>
            <li>Operate payment features (send, request, redeem);</li>
            <li>Understand usage patterns and improve UX;</li>
            <li>Communicate updates or security notices;</li>
            <li>Detect and prevent fraud or abuse;</li>
            <li>Comply with legal obligations.</li>
          </ul>
          <p className="mt-2">
            Where required by law, we rely on your consent or another valid legal basis.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">3. Analytics & Third-Party Tools</h2>
          <p>We may use privacy-respecting analytics tools to understand usage and performance.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>page views and events;</li>
            <li>device and region information;</li>
            <li>anonymized or pseudonymized identifiers.</li>
          </ul>
          <p className="mt-2">We do not sell your personal information.</p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">4. Cookies</h2>
          <p>We may use cookies for:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Necessary</strong> preferences (language, theme);</li>
            <li><strong>Analytics</strong> to understand usage.</li>
          </ul>
          <p className="mt-2">
            You can control cookies through your browser. Turning some off may affect your experience.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">5. How We Handle Wallet & Onchain Data</h2>
          <p>
            Beamio is non-custodial. When you connect a wallet:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>We may display your public address and relevant balances.</li>
            <li>We may log interactions for debugging and abuse prevention.</li>
            <li>We never store private keys or seed phrases.</li>
          </ul>
          <p className="mt-2">
            Onchain activity is public and cannot be erased.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">6. When We Share Information</h2>
          <p>We do not sell your information.</p>
          <p className="mt-2">We may share information with:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Service providers (hosting, analytics, email);</li>
            <li>Wallet or infra partners enabling functionality;</li>
            <li>Legal authorities when required;</li>
            <li>In a merger or acquisition (with safeguards).</li>
          </ul>
          <p className="mt-2">
            We may share aggregated or de-identified data.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">7. International Transfers</h2>
          <p>
            Your data may be processed in countries with different laws. We take necessary steps to ensure appropriate protection.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">8. Data Retention</h2>
          <p>We retain information as long as needed to provide the Service and meet legal requirements.</p>
          <p className="mt-2">Aggregated or de-identified data may be kept indefinitely.</p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">9. Your Choices & Rights</h2>
          <p>You may have rights depending on your jurisdiction, including:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>access or receive your data;</li>
            <li>request correction or deletion;</li>
            <li>object to certain processing;</li>
            <li>withdraw consent where applicable.</li>
          </ul>
          <p className="mt-2">
            Contact: <strong>[support@beamio.app]</strong>  
            (We may need to verify your identity.)
          </p>
          <p className="mt-1">We cannot modify onchain blockchain data.</p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">10. Children</h2>
          <p>
            Beamio is not intended for children under 18. If you believe a child has provided information, contact us to take appropriate action.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy. Continued use means you accept the revised Policy.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">12. Contact Us</h2>
          <p>Email: <strong>[support@beamio.app]</strong></p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="max-w-4xl mx-auto px-4 py-4 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-3 flex-wrap">
          <span>© {new Date().getFullYear()} Beamio</span>
          <a href="/" className="hover:text-slate-700 dark:hover:text-slate-200">
            Back to home
          </a>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPage
