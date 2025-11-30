import React,{useState, useEffect} from "react";
import BeamioLogo from './components/ui/BeamioLogo'
import Marquee from './components/ui/Marquee/Marquee'
import p1 from './assets/Website-P1.jpg'
import p2 from './assets/Website-P2.jpg'
import V5Video from "./components/ui/V5Video"
import HeroVideo from './components/ui/HeroVideo'
import CashcodeAPP from './components/ui/PayLink/index'

export const parseQueryParams = (queryString: string) => {
  const params = new Map();

  // Remove the leading '?' if present
  const cleanQueryString = queryString.startsWith("?")
    ? queryString.slice(1)
    : queryString;

  // Split the string into key-value pairs
  const pairs = cleanQueryString.split("&");

  for (const pair of pairs) {
    // Split each pair into key and value
    const [key, value] = pair.split("=").map(decodeURIComponent);
    // Only add if key is not undefined
    if (key) {
      params.set(key, value || "");
    }
  }

  return params;
}



const BeamioLanding: React.FC = () => {
	const [demoOpen, setDemoOpen] = useState<boolean>(false)
	const [code, setCode] = useState('')
	const [amt, setAmt] = useState('')
	const [note, setNote]  = useState('')
	const [recipient, setRecipient] = useState('')


	const init = () => {
		const queryParams = new URLSearchParams(window.location.search)
		if (queryParams?.size) {

			const code = queryParams.get("code")||''
			const address = queryParams.get("address")||''
			const _amt =  queryParams.get("amount")||''
			const _note = queryParams.get("note")||''
			
			if (code && address) {
				setCode(code)
				setNote(_note)
				setAmt(_amt)
				setRecipient(address)
				setDemoOpen(true)
			}
		}
	}


  	let first = true

  	useEffect(() => {
		if (first) {
			first = false
			init()
		}
  	}, [])

  return (
	<div className="min-h-screen flex flex-col bg-white text-slate-900">
	  {/* NAV */}
	  <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
		<BeamioLogo />
	  </div>

	  <div className="mt-16">
		{/* <Marquee /> */}
	  </div>

	  <main className="flex-1">
		
		<MainPage />
		{
			demoOpen && <CashcodeAPP recipient={recipient} code={code} setDemoOpen={setDemoOpen} lang={'en'} id={code} wallet={''} amt={amt} note={note}/>
		}
	  </main>

	  {/* FOOTER */}
	  <footer className="border-t border-slate-200 bg-slate-50">
		<div className="mx-auto max-w-6xl px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
		  <p className="text-[11px] text-slate-500">
			© {new Date().getFullYear()} Beamio · Built on Base · Stablecoin payments
		  </p>
		  <div className="flex gap-4 text-[11px] text-slate-500">
			{/* ✅ 这里直接跳 /terms */}
			<a href="/terms" className="hover:text-slate-600">Terms</a>
			<a href="/privacy" className="hover:text-slate-600">Privacy</a>
		  </div>
		</div>
	  </footer>
	</div>
  )
}

const appUrl = 'https://beamio.app/app'

// Rotating trustless manifesto strip
const messages = [
  "Money used to need trust.",
  "Then we trusted platforms.",
  "Now we have trustless rails.",
  "Beamio puts them in your pocket.",
  "No trust needed. Just beam.",
]

const TrustlessStrip: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
	const id = setInterval(() => {
	  setIndex((prev) => (prev + 1) % messages.length);
	}, 2600);
	return () => clearInterval(id);
  }, []);

  return (
	<div className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
	  <div className="mx-auto max-w-6xl px-4 lg:px-6 h-9 flex items-center justify-center">
		<div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50/80 px-3 sm:px-4 py-1 gap-2 shadow-sm">
		  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/10">
			<span className="h-2 w-2 rounded-full bg-sky-500" />
		  </span>
		  <div className="relative h-5 overflow-hidden flex items-center">
			<div
			  className="flex flex-col transition-transform duration-500 ease-out"
			  style={{ transform: `translateY(-${index * 100}%)` }}
			>
			  {messages.map((msg, i) => (
				<span
				  key={i}
				  className="h-5 flex items-center text-[11px] sm:text-xs font-medium tracking-wide text-slate-600 whitespace-nowrap"
				>
				  {msg}
				</span>
			  ))}
			</div>
		  </div>
		</div>
	  </div>
	</div>
  );
};

// Fees section
const FeesSection: React.FC = () => {
  return (
	<section className="bg-white border-t border-slate-100">
	  <div className="mx-auto max-w-6xl px-4 lg:px-6 py-16 space-y-8">
		<div className="max-w-2xl space-y-3">
		  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
			Fees that feel fair.
		  </h2>
		  <p className="text-sm sm:text-base text-slate-600">
			Friends beam for free. Codes and links cost a tiny “voucher fee”. All of it 0-gas for you.
		  </p>
		</div>
		<div className="grid gap-4 md:grid-cols-3">
		  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col justify-between">
			<div className="space-y-2">
			  <h3 className="text-sm font-semibold text-slate-900">
				Send to friends — 0% Beamio fee
			  </h3>
			  <p className="text-xs sm:text-sm text-slate-600">
				Move USDC between people you know for free. No gas to top up, no extra fee on top.
			  </p>
			</div>
			<p className="mt-4 text-[11px] text-slate-500">
			  Network gas is handled behind the scenes, so you never have to top it up.
			</p>
		  </div>
		  <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
			<div className="space-y-2">
			  <h3 className="text-sm font-semibold text-slate-900">
				Check codes & links — 0.8%
			  </h3>
			  <p className="text-xs sm:text-sm text-slate-600">
				When Beamio issues a check code or payment link, you pay a small voucher fee:
			  </p>
			  <ul className="mt-2 space-y-1 text-xs sm:text-sm text-slate-600">
				<li>
				  • <span className="font-medium">0.8% per payment</span>
				</li>
				<li>
				  • <span className="font-medium">Min 0.02 USDC, max 2 USDC</span>
				</li>
				
			  </ul>
			</div>
			<p className="mt-4 text-[11px] text-slate-500">
			  Think of it like a digital Money Order fee. Only when we create the voucher.
			</p>
		  </div>
		  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col justify-between">
			<div className="space-y-2">
			  <h3 className="text-sm font-semibold text-slate-900">No-gas experience</h3>
			  <p className="text-xs sm:text-sm text-slate-600">
				Onchain still uses gas, but Beamio covers it. You just:
			  </p>
			  <ul className="mt-2 space-y-1 text-xs sm:text-sm text-slate-600">
				<li>• Pay in USDC</li>
				<li>• Pick who you’re paying</li>
				<li>• Tap confirm</li>
			  </ul>
			</div>
			<p className="mt-4 text-[11px] text-slate-500">
			  No gas runs, no network switching.
			</p>
		  </div>
		</div>
	  </div>
	</section>
  );
};

// Infra section
const UnderTheHoodSection: React.FC = () => {
  return (
	<section className="bg-slate-50/60 border-t border-slate-100">
	  <div className="mx-auto max-w-6xl px-4 lg:px-6 py-16 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
		<div className="space-y-5">
		  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
		   Under the hood, it’s Base + x402. AA & Arc on the roadmap.
		  </h2>
		  <p className="text-sm sm:text-base text-slate-600">
			Beamio feels like a simple pay app, but it runs on real Web3 rails so your money stays programmable and yours.
		  </p>
		  <div className="space-y-4">
			<div className="space-y-1.5">
			  <h3 className="text-sm font-semibold text-slate-900">Base</h3>
			  <p className="text-xs sm:text-sm text-slate-600">
				Beamio runs on Base, Coinbase’s Ethereum L2, for fast, low-cost USDC payments.
			  </p>
			</div>
			<div className="space-y-1.5">
			  <h3 className="text-sm font-semibold text-slate-900">
				Powered by x402-style sessions
			  </h3>
			  <p className="text-xs sm:text-sm text-slate-600">
				Check codes and links behave like simple URLs, not scary raw transactions — still fully onchain underneath.
			  </p>
			</div>

			<div className="space-y-1.5">
			  <h3 className="text-sm font-semibold text-slate-900">
				Self-custody wallets
			  </h3>
			  <p className="text-xs sm:text-sm text-slate-600">
				Today Beamio uses standard EOA wallets, so you own the keys and the funds. Beamio just wraps it in a smoother UI.
			  </p>
			</div>

			<div className="space-y-1.5">
			  <h3 className="text-sm font-semibold text-slate-900">
				What’s next: AA + Arc
			  </h3>
			  <p className="text-xs sm:text-sm text-slate-600">
				We’re building toward AA smart accounts and Circle’s Arc network for 0-gas UX at scale and multi-currency stablecoin FX.
			  </p>
			</div>
			<p className="mt-4 text-[11px] text-slate-500">
			  In plain language: accounts are designed to be recoverable and verifiable without locking all your data in one company’s private database.
			</p>
		  </div>

		</div>
		<div className="relative">
		  <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-500/20 blur-3xl rounded-full pointer-events-none" />
		  <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl p-5 space-y-4">
			<V5Video />
			{/* <p className="text-xs font-medium text-slate-500 tracking-[0.18em] uppercase">
			  Beamio stack
			</p>
			<div className="space-y-3 text-xs sm:text-sm text-slate-700">
			  <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2">
				<span>Beamio app</span>
				<span className="text-[11px] text-slate-500">Send · Split · Tip · Links</span>
			  </div>
			  <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2">
				<span>Check codes & links (x402-style)</span>
				<span className="text-[11px] text-slate-500">Links · Codes · QRs</span>
			  </div>
			  <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2">
				<span>Self-custody wallets (EOA)</span>
				<span className="text-[11px] text-slate-500">You own the keys</span>
			  </div>
			  <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2">
				<span>Base L2</span>
				<span className="text-[11px] text-slate-500">USDC onchain</span>
			  </div>
			</div>
			<p className="text-[11px] text-slate-500">
			  Next up: AA smart accounts + Arc settlement for multi-currency stablecoin FX.
			</p> */}

		  </div>
		</div>
	  </div>
	</section>
  );
};

// Beamio main landing component
const MainPage: React.FC = () => {
  return (
	<div className="min-h-screen flex flex-col bg-white text-slate-900">
	  {/* NAV */}


		<div className="fixed top-4 left-4 z-50 flex items-center gap-3">
		
			<BeamioLogo />
		</div>
		
		<div className="mt-16">
			{/* <Marquee /> */}
		</div>

	  <main className="flex-1">
		{/* HERO */}
		<section id="hero" className="py-16 lg:py-24">
		<div className="mx-auto max-w-6xl px-4 lg:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

			{/* Text */}
			<div className="space-y-6">
			<h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 leading-tight">
				Beam money,
				<br className="hidden sm:block" /> not just vibes.
			</h1>
			<p className="text-base sm:text-lg text-slate-600 max-w-xl">
				Ping friends with free USDC transfers.
			</p>
			<p className="text-base sm:text-lg text-slate-600 max-w-xl">
				Or drop a Beamio check code or QR so anyone can beam you back.
			</p>
			<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
				<a
				href={appUrl}
				target="_blank"
				rel="noreferrer"
				className="inline-flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold px-6 py-2 transition"
				>
				Beam it now
				</a>
			</div>

			<p className="text-xs text-slate-500">
				Built on Base, with our own infra to keep 0-gas payments smooth even when things are busy.
			</p>
			</div>

			{/* Hero video */}
			<div className="relative">
			<div className="absolute -top-10 -right-6 w-40 h-40 bg-sky-500/30 blur-3xl rounded-full pointer-events-none" />

			<div className="relative rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_0_80px_rgba(56,189,248,0.15)] overflow-hidden">



				{/* 电脑用：横屏视频 (16:9) */}
				<HeroVideo />

			</div>
			</div>

		</div>
		</section>

		{/* FRIENDS */}
		<section id="friends" className="py-14 lg:py-20">
		  <div className="mx-auto max-w-6xl px-4 lg:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
			<div className="space-y-4">
			  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
				Not just another wallet. Your friend money, upgraded.
			  </h2>
			  <p className="text-sm sm:text-base text-slate-600">
			   Most crypto wallets are built for traders. Beamio is for real life: splitting dinner, paying back a ride, sending a birthday gift, supporting a creator.
			  </p>
			  <ul className="space-y-2 text-sm text-slate-600">
				<li>• Drop one link in the group chat — everyone pays their share.</li>
				<li>• Send a tiny gift that actually lands in a wallet.</li>
				<li>• Pay by name or @handle, like sending a DM</li>
			  </ul>
			  <p className="text-sm text-slate-500">
				No more: <span className="italic">“What’s your wallet address again?”</span>
			  </p>
			  <a href="#waitlist" className="inline-flex text-sm text-sky-400 hover:text-sky-300">
				See how Beamio works for friends →
			  </a>
			</div>
			<div className="rounded-3xl overflow-hidden">
				<img
					src={p1}
					alt="Beamio app UI showing group dinner split and birthday gift payment"
					className="w-full h-full object-cover"
				/>
			</div>
		  </div>
		</section>

		{/* PLACES */}
		<section id="places" className="py-14 lg:py-20 bg-slate-50 border-y border-slate-200">
		<div className="mx-auto max-w-6xl px-4 lg:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

			{/* 图片：小屏在下（order-2），大屏在左（lg:order-1） */}
			<div className="rounded-3xl overflow-hidden order-2 lg:order-1">
			<img
				src={p2}
				alt="Beamio app UI showing group dinner split and birthday gift payment"
				className="w-full h-full object-cover"
			/>
			</div>

			{/* 文字：小屏在上（order-1），大屏在右（lg:order-2） */}
			<div className="space-y-4 order-1 lg:order-2">
			<h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
				Your spots can Beamio too.
			</h2>
			<p className="text-sm sm:text-base text-slate-600">
				That café you always go to. The pop-up stall at the market. The designer you work with from another country. The creator whose posts you never miss.
			</p>
			<ul className="space-y-2 text-sm text-slate-600">
				<li>• Put a Beamio QR at the counter — guests scan, pick a tip, and pay.</li>
				<li>• Drop a Beamio link in a bio or menu — regulars can pay from anywhere.</li>
				<li>• Get paid without exposing a main wallet or going through a platform.</li>
			</ul>
			<p className="text-sm text-slate-500">
				For you, it’s just scan or tap. For them, it’s faster payouts and fewer fees.
			</p>
			<a href="#waitlist" className="inline-flex text-sm text-sky-400 hover:text-sky-300">
				See Beamio for business →
			</a>
			</div>

		</div>
		</section>

		{/* WEB3 WITHOUT HEADACHE */}
		<section id="web3" className="py-14 lg:py-20">
		  <div className="mx-auto max-w-5xl px-4 lg:px-6 space-y-8">
			<div className="text-center space-y-3">
			  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
				The cool parts of Web3, minus the homework.
			  </h2>
			  <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
				Gas, addresses, networks… we hide that in the back. You just tap pay.
			  </p>
			</div>
			<div className="grid md:grid-cols-3 gap-6">
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">No gas runs</h3>
				<p className="text-xs text-slate-500">
				  No more “I need to top up gas before I can pay.” Beamio shows: <span className="font-semibold">Pay 10 USDC → Confirm.</span> Gas is covered.
				</p>
			  </div>
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">No scary addresses</h3>
				<p className="text-xs text-slate-500">
				 No copying 0x… strings or guessing networks. You see people, links, and places — not chains.
				</p>
			  </div>
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">No full-wallet doxxing</h3>
				<p className="text-xs text-slate-500">
				  Keep everyday payments separate from your main vault, with onchain transparency if you want to check.
				</p>
			  </div>
			</div>
			<p className="text-center text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
			  If you’re already in Web3 it feels like: “Finally, a no-brain-cells mode for small payments.” If you’re new, it feels like: “Wait… this is just a global Venmo.”
			</p>
			
		  </div>
		</section>

		{/* AUDIENCES */}
		<section id="audiences" className="py-14 lg:py-20 bg-slate-50 border-y border-slate-200">
		  <div className="mx-auto max-w-6xl px-4 lg:px-6 space-y-6">
			<div className="text-center space-y-2">
			  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
				Web3 native or not, you’re good.
			  </h2>
			</div>
			<div className="grid md:grid-cols-2 gap-8">
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
				<h3 className="text-sm font-semibold text-slate-900">If you’re already in Web3…</h3>
				<ul className="space-y-2 text-xs text-slate-500">
				  <li>• Keep the wallet you like.</li>
				  <li>• Stop thinking about gas on tiny payments.</li>
				  <li>• Stop parking stablecoins in custodial apps.</li>
				</ul>
				<p className="text-xs text-slate-600">You keep your keys. Beamio kills the friction.</p>
			  </div>
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
				<h3 className="text-sm font-semibold text-slate-900">If you just use normal pay apps…</h3>
				<ul className="space-y-2 text-xs text-slate-500">
				  <li>• Search a name, scan a code, or tap a link.</li>
				  <li>• Type how much.</li>
				  <li>• Tap pay. That’s it.</li>
				</ul>
				<p className="text-xs text-slate-600">
				  No need to learn “gas” or chains. It just feels like your usual pay app, but works globally.
				</p>
			  </div>
			</div>
		  </div>
		</section>

		{/* FOUR THINGS */}
		<section id="features" className="py-14 lg:py-20">
		  <div className="mx-auto max-w-6xl px-4 lg:px-6 space-y-8">
			<div className="text-center space-y-2">
			  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
				Four little money things, made stupid-easy.
			  </h2>
			</div>
			<div className="grid md:grid-cols-2 gap-6">
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">Send money</h3>
				<p className="text-xs text-slate-500">
				  To friends, roommates, teammates. With links, QRs, or @handles — not long 0x strings.
				</p>
			  </div>
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">Get paid</h3>
				<p className="text-xs text-slate-500">
				  For side gigs, freelance work, or your shop. Drop payment links or codes anywhere you show up.
				</p>
			  </div>
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">Gift & tip for real</h3>
				<p className="text-xs text-slate-500">
				  Say thanks from $0.01 and up. Likes are nice — a tiny onchain tip hits different.
				</p>
			  </div>
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">Split anything</h3>
				<p className="text-xs text-slate-500">
				  Trips, groceries, tickets, game nights. One link in the chat, everyone taps their share.
				</p>
			  </div>
			</div>
		  </div>
		</section>

		{/* WHY PEOPLE STAY */}
		<section id="why" className="py-14 lg:py-20 bg-slate-50 border-y border-slate-200">
		  <div className="mx-auto max-w-5xl px-4 lg:px-6 space-y-6 text-center">
			<h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
			  Why people stick with Beamio.
			</h2>
			<div className="grid md:grid-cols-3 gap-6 text-left">
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">It’s simple</h3>
				<p className="text-xs text-slate-500">
				  Open, type, tap, done. Feels like a normal pay app, not a trading terminal.
				</p>
			  </div>
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">It’s more free</h3>
				<p className="text-xs text-slate-500">
				  No borders, no business hours. Beam a bit of value to anyone, anywhere, whenever you feel like it.
				</p>
			  </div>
			  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
				<h3 className="text-sm font-semibold text-slate-900">It’s more yours</h3>
				<p className="text-xs text-slate-500">
				  Your money doesn’t sit in a middleman’s account. It moves on rails you can audit any time.
				</p>
			  </div>
			</div>
		  </div>
		</section>

		{/* WAITLIST CTA */}
		<section id="waitlist" className="py-12 lg:py-16 bg-slate-50">
		  <div className="mx-auto max-w-4xl px-4 lg:px-6 text-center space-y-4">
			<h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
			  Ready to beam your first USDC?
			</h2>
			<p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
			  Our first web MVP is live. Open it in your browser, send a tiny USDC payment, and feel what Beamio is like in real life.
			</p>
			<div className="mt-4 flex justify-center">
			  <a
				href={appUrl}
				target="_blank"
				rel="noreferrer"
				className="inline-flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-semibold px-6 py-2 transition"
			  >
				Open Beamio MVP
			  </a>
			</div>
			<p className="text-[11px] text-slate-500">
			  Opens in a new tab. MVP currently supports USDC on Base with a 0-gas experience.
			</p>
		  </div>
		</section>

		{/* Fees & infra sections */}
		<FeesSection />
		<UnderTheHoodSection />
	  </main>
	</div>
  );
}


export default BeamioLanding