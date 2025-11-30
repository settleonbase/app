import React from "react"

const TermsPage: React.FC = () => {
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
          Beamio Terms of Use
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Welcome to Beamio (the “Service”). These Terms of Use (“Terms”) are a legal agreement between you (“you”, “user”) and
          <span className="font-medium"> [Beamio, Inc.]</span> (“Beamio”, “we”, “us”, or “our”) governing your access to and use of our website at{" "}
          <span className="font-mono text-slate-900 dark:text-slate-100">beamio.app</span> and any related web, mobile, or developer interfaces we provide (collectively, the “Site”).
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </p>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 pb-16 space-y-8 text-sm text-slate-700 dark:text-slate-200">
        {/* 1. What Beamio Is */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            1. What Beamio Is (and Is Not)
          </h2>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            1.1 Interface, not a bank.
          </h3>
          <p>
            Beamio is a non-custodial interface that helps you send, request, and receive stablecoins (for example, USDC) on supported blockchains
            (currently including Base). We do not hold your funds, take custody of your private keys, or control your onchain assets.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            1.2 No financial, investment, or legal advice.
          </h3>
          <p>
            Nothing on Beamio is investment advice, financial advice, or legal advice. You are solely responsible for your decisions and for complying
            with applicable laws in your jurisdiction.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            1.3 No guarantee of availability.
          </h3>
          <p>
            The Service may change, be interrupted, or be discontinued at any time, including for maintenance, upgrades, or security reasons.
          </p>
        </section>

        {/* 2. Eligibility */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            2. Eligibility
          </h2>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            2.1 Age.
          </h3>
          <p>
            You must be at least 18 years old (or the age of majority in your jurisdiction) to use Beamio.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            2.2 Restricted jurisdictions.
          </h3>
          <p>
            You may not use Beamio if doing so would violate applicable laws or if you are subject to sanctions or restrictions under any applicable
            regime. We may restrict or block access from certain jurisdictions at our discretion.
          </p>
        </section>

        {/* 3. Responsibilities */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            3. Your Responsibilities
          </h2>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            3.1 Wallets &amp; keys.
          </h3>
          <p>
            You are responsible for the security of your wallet, devices, and private keys. If you lose access to your wallet, we cannot recover your
            assets or reverse transactions.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            3.2 Irreversible transactions.
          </h3>
          <p>
            Blockchain transactions (including those triggered through Beamio) are generally irreversible. Always double-check amounts, recipients, and
            network details before confirming.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            3.3 Accurate information.
          </h3>
          <p>
            If you provide us with any information (such as an email address for waitlists or updates), you agree that it is accurate and that you have
            the right to use it.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            3.4 Lawful use.
          </h3>
          <p>
            You agree not to use Beamio for any illegal, fraudulent, or prohibited activities, including money laundering, terrorist financing, sanctions
            evasion, or any activity that violates applicable law or these Terms.
          </p>
        </section>

        {/* 4. Fees */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            4. Fees &amp; Payments
          </h2>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            4.1 Beamio service fees.
          </h3>
          <p>
            Beamio may charge service fees for certain actions, for example:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>0% Beamio fee for direct “Send” transfers between friends;</li>
            <li>Percentage + minimum / maximum fees for check codes, payment links, and merchant features;</li>
            <li>Other clearly disclosed fees for premium or business functionality.</li>
          </ul>
          <p className="mt-2">
            The specific fees applicable to the Service are described in the product interface and/or on our pricing page.
            By using the Service, you agree to the fees shown at the time of the transaction.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            4.2 Network fees &amp; sponsored gas.
          </h3>
          <p>
            Underlying blockchains may charge network fees (“gas”). In some cases, Beamio or its partners may sponsor or abstract gas costs; in other cases,
            you may bear gas costs directly. Any “no gas” or “0 gas” experience refers to your user experience in the interface and does not guarantee that
            no gas is consumed on the underlying network.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            4.3 Third-party fees.
          </h3>
          <p>
            Your wallet provider, exchange, or bank may charge additional fees. Beamio is not responsible for such fees.
          </p>
        </section>

        {/* 5. Non-custodial */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            5. Non-Custodial Nature
          </h2>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            5.1 You stay in control.
          </h3>
          <p>
            Beamio does not hold, freeze, or move your assets on your behalf. When you confirm a transaction, it is broadcast from your wallet (or smart
            account) to the network.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            5.2 Smart contracts &amp; protocols.
          </h3>
          <p>
            Beamio may display or interact with smart contracts (for example, for check codes, payment links, or account abstraction). We do not control
            these protocols once deployed. You are responsible for understanding the risks of using them.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            5.3 No FDIC or deposit insurance.
          </h3>
          <p>
            Your digital assets are not deposits, are not insured by the FDIC or any government agency, and may lose value.
          </p>
        </section>

        {/* 6. Third-party services */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            6. Third-Party Services
          </h2>
          <p>
            Beamio may integrate with or link to third-party services, including blockchain networks, wallets, analytics tools, or payment partners. We do
            not control and are not responsible for third-party services. Your use of third-party services may be subject to their own terms and privacy
            policies.
          </p>
        </section>

        {/* 7. Beta / warranties */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            7. Beta, Changes &amp; No Warranties
          </h2>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            7.1 Beta / MVP.
          </h3>
          <p>
            Parts of Beamio may be labeled as “beta” or “MVP”. These features may be incomplete, may change without notice, and may not function as expected.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            7.2 No warranties.
          </h3>
          <p>
            The Service is provided “AS IS” and “AS AVAILABLE” without warranties of any kind, whether express or implied, including without limitation
            warranties of merchantability, fitness for a particular purpose, non-infringement, or that the Service will be error-free or secure.
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-1">
            7.3 Risk acknowledgement.
          </h3>
          <p>
            You understand that using blockchain technology and digital assets involves risks, including smart contract bugs, network congestion, changes to
            protocol rules, loss of private keys, and price volatility.
          </p>
        </section>

        {/* 8. Limitation of liability */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            8. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law:
          </p>
          <p className="mt-2">
            Beamio and its directors, officers, employees, and affiliates will not be liable for any indirect, incidental, special, consequential, or
            punitive damages, or any loss of profits or revenue, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
            intangible losses arising out of or related to your use of the Service.
          </p>
          <p className="mt-2">
            Our total liability arising from or related to the Service will not exceed the greater of: (a) the amount of fees you paid to Beamio for the
            Service in the 3 months preceding the event giving rise to the claim, or (b) USD $50.
          </p>
          <p className="mt-2">
            Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under applicable law.
          </p>
        </section>

        {/* 9. Indemnification */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            9. Indemnification
          </h2>
          <p>
            You agree to indemnify and hold harmless Beamio and its affiliates, officers, directors, employees, and agents from any claims, damages, losses,
            liabilities, and expenses (including reasonable attorneys’ fees) arising out of or relating to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>your use of the Service;</li>
            <li>your violation of these Terms; or</li>
            <li>your violation of any rights of any third party or applicable law.</li>
          </ul>
        </section>

        {/* 10. Changes */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            10. Changes to the Service and Terms
          </h2>
          <p>
            We may update the Service and these Terms from time to time. If we make material changes, we will update the “Last updated” date and may
            provide additional notice (for example, via the Site). By continuing to use the Service after changes take effect, you agree to the revised
            Terms.
          </p>
        </section>

        {/* 11. Governing law */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            11. Governing Law &amp; Disputes
          </h2>
          <p>
            These Terms are governed by the laws of [State / Country], without regard to its conflict of law rules.
          </p>
          <p className="mt-2">
            Any dispute arising out of or relating to these Terms or the Service will be subject to the exclusive jurisdiction of the courts located in
            [City, State / Country], unless applicable law requires a different venue.
          </p>
        </section>

        {/* 12. Contact */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            12. Contact
          </h2>
          <p>
            If you have questions about these Terms, you can reach us at:
          </p>
          <p className="mt-1">
            Email: [support@beamio.app]
          </p>
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

export default TermsPage
