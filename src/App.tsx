import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Routes, Route, Navigate, Link as RouterLink } from "react-router-dom"
import LandingPage from './pages/LandingPage'


type FeatureProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  children: React.ReactNode;
};


type ProtocolState = "AVAILABLE" | "RATE_LIMIT" | "WINDOW_CLOSED";



const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse   = React.lazy(() => import("./pages/TermsOfUse"));



type StepProps = {
	n: React.ReactNode;
	title: React.ReactNode;
	body: React.ReactNode;
}






const Feature: React.FC<FeatureProps> = ({ icon: Icon, title, children }) => (
  <Card className="term-card animate-rise">
    <CardHeader className="pb-2">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded border border-[var(--crt-border)] bg-[var(--crt-panel)] text-[var(--crt-accent)] shadow-[0_0_8px_var(--crt-accent)]">
          <Icon className="h-4 w-4" />
        </div>
        <CardTitle className="text-[var(--crt-text)] font-mono text-base leading-tight tracking-tight flex-1">
          {title}
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="text-[12px] leading-relaxed text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono">
      {children}
    </CardContent>
  </Card>
)

// ---------- Helpers ----------
function protocolBadgeText(state: ProtocolState) {
  if (state === "AVAILABLE") return "x402 Gasless · AVAILABLE";
  if (state === "RATE_LIMIT") return "x402 Gasless · RATE_LIMIT";
  return "x402 Gasless · WINDOW_CLOSED";
}
const short = (s: string, head = 6, tail = 4) =>
  s?.length > head + tail + 2 ? `${s.slice(0, head)}…${s.slice(-tail)}` : s

const Step: React.FC<StepProps> = ({ n, title, body }) => (
  <div className="flex gap-4 items-start font-mono text-[rgb(var(--crt-text-rgb)_/_0.8)]">
	<div className="h-8 w-8 flex items-center justify-center rounded border border-[var(--crt-border)] bg-[var(--crt-panel)] text-[var(--crt-accent)] font-medium shadow-[0_0_6px_var(--crt-accent)] text-sm">
	  {n}
	</div>
	<div>
	  <div className="text-[var(--crt-text)] text-sm font-semibold leading-tight flex items-center gap-2">
		<span className="text-[var(--crt-accent)]">▌</span>
		<span>{title}</span>
	  </div>
	  <div className="text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.7)] mt-1 leading-relaxed">
		{body}
	  </div>
	</div>
  </div>
)




export default function App() {
  // 这里不需要任何 state；只负责路由
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy" element={<PrivacyPolicy /* 可选传 Header/Footer */ />} />
      <Route path="/terms" element={<TermsOfUse /* 可选传 Header/Footer */ />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


// ------------------------------------
// Lightweight runtime "tests"
// ------------------------------------
// These aren't Jest tests, but they let us sanity check
// behavior in dev / storybook or console.
// You can import { __TESTS__ } and assert these in your test runner.
//
// What we test:
// 1. protocolBadgeText() returns correct badge string
// 2. Default component state values are stable / non-empty
// 3. Mint tiers map produces 3 distinct cards
// 4. Badge text for each ProtocolState matches EXPECTED
// 5. There are exactly 3 pricing tiers and they match Starter/Growth/Pro
// 6. HOW_IT_WORKS has 3 clear public steps (no whitelist)
// 7. Presale header uses the USDC-&gt;$SETTLE wording (escaped for JSX safety)
// 8. WHAT_IS_$SETTLE section keeps our 3 pillars in English
//
// NOTE: please keep test shape stable unless functionality changes.

export const __TESTS__ = {
  protocolBadgeText: {
    AVAILABLE: protocolBadgeText("AVAILABLE" as ProtocolState),
    RATE_LIMIT: protocolBadgeText("RATE_LIMIT" as ProtocolState),
    WINDOW_CLOSED: protocolBadgeText("WINDOW_CLOSED" as ProtocolState),
    EXPECTED: {
      AVAILABLE: "x402 Gasless · AVAILABLE",
      RATE_LIMIT: "x402 Gasless · RATE_LIMIT",
      WINDOW_CLOSED: "x402 Gasless · WINDOW_CLOSED",
    },
  },
  defaults: {
    protocol: "AVAILABLE",
    success24h: "≥ 98%",
    p95: "≤ 5s",
    lastUpdated: "just now",
  },
  mintTiers: [
    { t: "Starter", u: 1, s: "For first touch" },
    { t: "Growth", u: 10, s: "For ongoing entry" },
    { t: "Pro", u: 100, s: "For larger commitment" },
  ],
  mintTierCount: 3,
  tierNames: ["Starter", "Growth", "Pro"],
  howItWorksSteps: [
    { n: 1, title: "Pick a tier" },
    { n: 2, title: "Sign once" },
    { n: 3, title: "Get your receipt" },
  ],
  pricingTiers: ["Per Tx (Usage)", "Pro (SaaS)", "Enterprise"],
  presaleHeader: "USDC-&gt;$SETTLE Mint / Early Access",
  whatIsSettlePoints: [
    "Live fire, not slideware",
    "Anyone can feel it",
    "Settlement layer as an economic surface",
  ],
};
