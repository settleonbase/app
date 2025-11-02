import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import ConnectWallet from './components/ui/ConnectWallet'
import { initEIP6963Discovery } from "./lib/eip6963";


import { getInjectedProvider, EIP1193Provider } from "./lib/utils";
import SETTLE_ABI from './lib/sellte-abi.json'
import {
  CheckCircle2,
  Hourglass,
  RefreshCcw,
  Link as LinkIcon,
  Gauge,
  ShieldCheck,
  Zap,
} from "lucide-react";

import logo from './assets/logo.png'
import {ethers} from 'ethers'

// Landing page for Settle / $SETTLE presale
// STYLE MODE: retro hacker / early-internet terminal vibe
// - CRT green-on-black
// - scanlines overlay
// - ticker feels like system log
// This page is BOTH:
//   1. The official site explaining what SETTLE solves (infra company)
//   2. The presale / mint UI for $SETTLE on Base, gasless via x402
// NOTE: __TESTS__ exported at bottom for sanity checks

// ---------- Types ----------
type StatProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
};

type FeatureProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  children: React.ReactNode;
};

type StepProps = {
  n: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
};

type ProtocolState = "AVAILABLE" | "RATE_LIMIT" | "WINDOW_CLOSED";

const short = (s: string, head = 6, tail = 4) =>
  s?.length > head + tail + 2 ? `${s.slice(0, head)}…${s.slice(-tail)}` : s;

function pickApprovedProvider(): any | null {
	const w = window as any;
	const eth = w.ethereum;
	if (!eth) return null;
	const providers: any[] = Array.isArray(eth?.providers) ? eth.providers : [eth];
	// 优先顺序：MetaMask > Coinbase > OKX
	const pick =
		providers.find(p => p.isMetaMask) ??
		providers.find(p => (p as any).isCoinbaseWallet) ??
		providers.find(p => (p as any).isOkxWallet) ??
		providers[0] ?? null;
		return pick || null;
}

function isApprovedProvider(p: any) {
	return !!(p?.isMetaMask || p?.isCoinbaseWallet || p?.isOkxWallet);
}

// ---------- Small Components ----------
const Stat: React.FC<StatProps> = ({ label, value, sub }) => (
  <div className="flex flex-col items-start">
    <div
      className="text-2xl md:text-3xl font-semibold leading-none tracking-tight text-[var(--crt-accent)] drop-shadow-[0_0_4px_var(--crt-accent)]"
      data-testid="stat-value"
    >
      {value}
    </div>
    <div className="text-[10px] md:text-xs text-[var(--crt-dim)] mt-1 uppercase tracking-wide">
      {label}
    </div>
    {sub && (
      <div className="text-[10px] text-[rgb(var(--crt-dim-rgb)_/_0.8)] mt-1">{sub}</div>
    )}
  </div>
);


type presale_data = {
	tx: string
	address: string
	usdc: string
	amount: string
}
const data: presale_data[] = [
	{
		tx: '0x323ba62d4395d3aa2238f9d1f4f11fe8c082fc24e3669ec4bad2eb8562392de8',
		address: '0x8364cb7270C203628E0659dA96355a7a92CFfecf',
		usdc: '10.00',
		amount: '70000.00'
	},
	{
		tx: '0x8b7ab606d3e9b518ecb13753609e73a35a985a6d515e229e2d1acfeeddb3aac2',
		address: '0x8364cb7270C203628E0659dA96355a7a92CFfecf',
		usdc: '1.00',
		amount: '7000.00'
	},
	{
		tx: '0xca0934336141a4192583ee17e225a91847f7d750ec27dd55dd0f1806937eeccc',
		address: '0x8364cb7270C203628E0659dA96355a7a92CFfecf',
		usdc: '1.00',
		amount: '7000.00'
	},
	{
		tx: '0xf24e570e8190f65b128e70b08688ca83c65234ec20d4fcf453b365651129cb4b',
		address: '0x8364cb7270C203628E0659dA96355a7a92CFfecf',
		usdc: '1.00',
		amount: '7000.00'
	},
	{
		tx: '0x7c6c03bc7bf19b5d2183dc97c119015a85b7b53a60c3cc4b49a2fae05ec6746e',
		address: '0x8364cb7270C203628E0659dA96355a7a92CFfecf',
		usdc: '1.00',
		amount: '7000.00'
	},
	{
		tx: '0x77da6176000d5e20170c235a67192af22d7ff54cfac4c1f54af60ce7c0511eb2',
		address: '0x8364cb7270C203628E0659dA96355a7a92CFfecf',
		usdc: '1.00',
		amount: '7000.00'
	}
]

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
);

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
);

function formatBalance(num: string | number): string {
	const n = typeof num === "string" ? parseFloat(num) : num;
	if (isNaN(n)) return "-";
	if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + " G";
	if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + " M";
	if (n >= 1_000) return (n / 1_000).toFixed(2) + " K";
	return n.toFixed(2);
}

// ---------- Helpers ----------
function protocolBadgeText(state: ProtocolState) {
  if (state === "AVAILABLE") return "x402 Gasless · AVAILABLE";
  if (state === "RATE_LIMIT") return "x402 Gasless · RATE_LIMIT";
  return "x402 Gasless · WINDOW_CLOSED";
}

// ===== EIP-3009 (USDC-like) defaults =====
const EIP3009 = {
	USDEAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",			//		USDC mainnet address
	tokenName: "USD Coin",   
	tokenVersion: "2",
	USDC_decimals: 6,             
	AUTHORIZED_RECEIVER: "0x87cAeD4e51C36a2C2ece3Aaf4ddaC9693d2405E1",
	Base_chainID: 8453,
	SETTLE_symbol: 'SETTLE',
	SETTLE_SC_addr:'0x543F0d39Fc2C7308558D2419790A0856fA499423',
	SETTLE_decimals: 18,
}

// Minimal ABI for the balanceOf function
const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
]

const baseProvider = new ethers.JsonRpcProvider('https://base-rpc.publicnode.com')
const USDC_SC_readonly = new ethers.Contract(EIP3009.USDEAddress, erc20Abi, baseProvider)
const SETTLE_SC_readonly = new ethers.Contract(EIP3009.SETTLE_SC_addr, SETTLE_ABI, baseProvider)


type ISettle_status = {
	isPending: boolean
	pendingMintsCountTotal: number
	pendingAmount: string
	totalUSDC: string
	totalMint: string
}
const getStatus = async (): Promise<ISettle_status|null> => {
	try {
		const status:ISettle_status = await SETTLE_SC_readonly.getPendingStatus()
		const ret: ISettle_status = {
			isPending: status.isPending,
			pendingMintsCountTotal: status.pendingMintsCountTotal,
			pendingAmount: formatBalance(ethers.formatEther(status.pendingAmount)),
			totalUSDC: formatBalance(ethers.formatUnits(status.totalUSDC, 6)),
			totalMint: formatBalance(ethers.formatUnits(status.totalMint, 18))
		}
		return ret
	} catch (ex) {
		return null
	}
}



export default function SettleLanding() {

	const providerRef = useRef<any>(null)
	const [optedIn, setOptedIn] = useState(false)
  // ---------- State: status/SLO from /api/status ----------

	const [protocol, setProtocol] = useState<ProtocolState>("AVAILABLE")
	const [success24h, setSuccess24h] = useState<string>("≥ 98%");
	const [p95, setP95] = useState<string>("≤ 5s")
	const [lastUpdated, setLastUpdated] = useState<string>("just now")
	const [authJson, setAuthJson] = useState<string>("")
	const [amountInput, setAmountInput] = useState<string>("1") // 默认 1 USDC

	// ---------- Wallet state ----------
	const [account, setAccount] = useState("")

	const [chainId, setChainId] = useState<number | null>(null)
	const [usdcBalance, setUsdcBalance] = useState<string>("-")
	const [sobBalance, setSobBalance] = useState<string>("-")
	const [sobPaddingBalance, setSobPaddingBalance] = useState<string>("-")
	const [isPedding, setIsPedding] = useState(true)
	const [totalUSDC, setTotalUSDC] = useState('0')
	const [preMintCount, setPreMintCount] = useState(0)
	const [pendingAmount, setPendingAmount] = useState('0')
	const [totalSupply, setTotalSupply] = useState('0')
	const [liveData, setLiveData] = useState(data)
	const [flashKey, setFlashKey] = useState<string | null>(null);
	const [walletProvider, setWalletProvider] = useState<EIP1193Provider|null>(null)



	const accountRef = useRef(account)

	useEffect(()=>{ accountRef.current = account }, [account])
	const currectBlockRef = useRef(0)


	const fetchPresaleStatus = async () => {
		const status = await getStatus()
		if (status) {
			setIsPedding(status.isPending)
			setTotalUSDC(status.totalUSDC)
			setPreMintCount(status.pendingMintsCountTotal)
			setPendingAmount(status.pendingAmount)
			setTotalSupply(status.totalMint)
		}
	}

	function generateNonce(): string {
		return ethers.hexlify(ethers.randomBytes(32))
	}

	const TRANSFER_WITH_AUTHORIZATION_TYPES = {
		TransferWithAuthorization: [
			{ name: "from", type: "address" },
			{ name: "to", type: "address" },
			{ name: "value", type: "uint256" },      // ✅ 是 uint256，不是 string
			{ name: "validAfter", type: "uint256" },
			{ name: "validBefore", type: "uint256" },
			{ name: "nonce", type: "bytes32" },      // ✅ 是 bytes32，不是 string
		],
	}

	// ============================================
	// 1. 定义 EIP-712 Domain
	// ============================================
	const getDomain = (chainId: number) => {
		const ret = chainId === 8453 
		? {
			name: "USD Coin",  // USDC 的名称
			version: "2",      // USDC 版本
			chainId: chainId,  // Base chainId = 8453
			verifyingContract: EIP3009.USDEAddress, // USDC 合约地址
		}
		: null
		return ret
		
	}


	const signEIP3009Authorization = async () => {
		
		if (!walletProvider) {
			(window as any).openConnectWallet?.();
			window.dispatchEvent(new CustomEvent("wallet:openConnectModal"));
			console.error("❌ Wallet provider not available")
			return
		}

		const provider = new ethers.BrowserProvider(walletProvider)
		const signer = await provider.getSigner()
		const signerAddress = await signer.getAddress();
		if (signerAddress.toLowerCase() !== account.toLowerCase()) {
			return console.warn("Signer 与 account 不一致");
		}
		const domain = getDomain(EIP3009.Base_chainID)
		if (!domain) {
			return
		}

		// ============================================
		// 参数配置
		// ============================================
		const usdcAmount = ethers.parseUnits(amountInput || "1", 6) // BigInt
		const now = Math.floor(Date.now() / 1000)
		const validAfter = now
		const validBefore = now + 3600 // 1小时有效期
		
		// ✅ 生成 bytes32 格式的 nonce
		const nonce = generateNonce()
		
		console.log("📋 Message parameters:")

		// ============================================
		// ✅ 构造 EIP-712 typedData
		// ============================================
		const typedData = {
			types: TRANSFER_WITH_AUTHORIZATION_TYPES,
			primaryType: "TransferWithAuthorization",  // ✅ 必须与 types 的 key 匹配
			domain,
			message: {
				from: account,
				to: EIP3009.AUTHORIZED_RECEIVER,
				value: usdcAmount.toString(),  // ✅ 转为 string（ethers.js 会处理类型）
				validAfter: validAfter.toString(),  // ✅ uint256 -> string
				validBefore: validBefore.toString(),  // ✅ uint256 -> string
				nonce: nonce,  // ✅ bytes32 格式的 hex 字符串
			},
		}

		console.log("📋 EIP-712 TypedData:")
		console.log(JSON.stringify(typedData, null, 2))

		// ============================================
		// 调用 eth_signTypedData_v4
		// ============================================
		let sig: string
		// 3. 使用 ethers 签名（自动调用 eth_signTypedData_v4）

		try {
			sig = await signer.signTypedData(typedData.domain, typedData.types, typedData.message)
			const vrs = ethers.Signature.from(sig)
			console.log("ethers 签名成功:", vrs);
		} catch (err: any) {
			console.error("签名失败:", err.message);
			return;
		}

		// ============================================
		// 构造请求体，发往后端
		// ============================================
		const body402 = {
			EIP712: typedData,
			sig: sig,
		}

		console.log("📤 Request body being sent:")
		console.log(JSON.stringify(body402, null, 2))
		//const local = 'http://127.0.0.1:4088/api/mintTestnet'
		const endpoint = 'https://api.settleonbase.xyz/api/mintTestnet'
		try {
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body402),
			})

			console.log(`📍 HTTP Status: ${response.status}`)
			
			const contentType = response.headers.get('content-type')
			let result: any
			
			if (contentType?.includes('application/json')) {
				result = await response.json()
			} else {
				const text = await response.text()
				console.error("❌ Non-JSON response:", text)
				return
			}

			console.log("✅ Server response:", result)

			if (response.ok && result.success) {
				console.log("✅ Signature verified successfully")
				console.log("✅ Signature components:", result.signatureComponents)
				setAuthJson(JSON.stringify(result, null, 2))
				
			} else if (result.error) {
				console.error("❌ Server error:", result.error)
				setAuthJson(JSON.stringify({ error: result.error }, null, 2))
			}
		} catch (error) {
			console.error("❌ Network request failed:", error)
			setAuthJson(JSON.stringify({ 
				error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
			}, null, 2))
		}
	}

	//	https://api.settleonbase.xyz/api/mint-testnet
	useEffect(() => {
		// --- 单例监听器，避免 StrictMode / HMR 反复注册 ---
		const KEY = "__SETTLE_LIVE_HANDLER__";
		// 如果已有旧的，先解绑
		if ((window as any)[KEY]) {
			window.removeEventListener("settle:live", (window as any)[KEY]);
		}

		const handler = (e: any) => {
			const item = e?.detail as presale_data | undefined;
			if (!item) return;

			  const __kid =
				(item as any).__kid ??
				(item.tx && item.tx.length > 0
				? item.tx
				: (crypto as any)?.randomUUID?.() || `k-${Date.now()}-${Math.random()}`);

			setLiveData(prev => {
				const key = item.tx && item.tx.length > 0 ? item.tx : __kid;
				if (prev.some(d => (d.tx && d.tx.length > 0 ? d.tx : (d as any).__kid) === key)) {
				return prev; // 去重
				}
				return [{ ...(item as any), __kid }, ...prev].slice(0, 50);
			});
			const keyForFlash = item.tx && item.tx.length > 0 ? item.tx : __kid;
			setFlashKey(prev => (prev === keyForFlash ? `${keyForFlash}#` : keyForFlash));
		};
		
		window.addEventListener("settle:live", handler as any);
		(window as any)[KEY] = handler;

		// 推送入口（同名覆写即可，保持单例）
		(window as any).pushLiveMint = (item: presale_data) =>
			window.dispatchEvent(new CustomEvent("settle:live", { detail: item }));

		return () => {
			// 保持页面卸载时清理
			window.removeEventListener("settle:live", handler as any);
			if ((window as any)[KEY] === handler) {
			delete (window as any)[KEY];
		}
		delete (window as any).pushLiveMint;
		};
	}, []);
	
  useEffect(() => {
		let cancelled = false;
		async function fetchStatus() {
		try {
			const res = await fetch("/api/status", { cache: "no-store" });
			if (!res.ok) throw new Error("status non-200");
			const data = await res.json();
			// Expected shape: { protocol, success24h, p95 }
			if (!cancelled) {
			setProtocol((data.protocol as ProtocolState) || "AVAILABLE");
			setSuccess24h(data.success24h || "≥ 98%");
			setP95(data.p95 || "≤ 5s");
			setLastUpdated(new Date().toLocaleTimeString());
			}
		} catch {
			// Keep defaults; optionally surface a subtle hint later
		}
		}
		
		fetchStatus();
		listening()
		initEIP6963Discovery();
		providerRef.current = pickApprovedProvider()

		const id = setInterval(fetchStatus, 15000);
		return () => {
		cancelled = true;
		clearInterval(id);
		};
  }, []);

	const erc20BalanceOf= async (sc: ethers.Contract, owner: string, decimals: number): Promise<string> => {
		try {
			const kk = await sc.balanceOf (owner)
			const ret = parseFloat(ethers.formatUnits(kk, decimals)).toFixed(2)
			return ret
		} catch (ex) {
			return "-"
		}
		
	}



	const refreshBalances = async () => {

		// dummy data
		const usdc = (Math.random() * 10).toFixed(2)
		const _data: presale_data = {
			tx: '0x8f7944044abb7d3725e79fd92efad190d8ac60f1cd7f4f36b41e6e0f50ec67b' + (Math.random()*10).toFixed(0),
			usdc,
			address: '0x8364cb7270C203628E0659dA96355a7a92CFfecf',
			amount: (parseFloat(usdc) * 7000).toFixed(2),
		}
		// @ts-ignore
		window.pushLiveMint(_data)

		// 关键：用 ref 读最新地址
		const owner = accountRef.current
		if (!owner) return

		try {
			
			// USDC
			const [usdcRaw, SETTLE, paddingSETTLE] = await SETTLE_SC_readonly.getAccountInfo(owner)
			const usdc = parseFloat(ethers.formatUnits(usdcRaw, EIP3009.USDC_decimals)).toFixed(2)
			const settle_b = parseFloat(ethers.formatUnits(SETTLE, EIP3009.SETTLE_decimals)).toFixed(2)
			const settle_padding = parseFloat(ethers.formatUnits(paddingSETTLE, EIP3009.SETTLE_decimals)).toFixed(2)
			setUsdcBalance(formatBalance(usdc))
			setSobPaddingBalance(formatBalance(settle_padding))
			setSobBalance(formatBalance(settle_b))
			
		} catch {
			// ignore
		}
		
	}

	// Detect wallet connection & listen to changes
	useEffect(() => {
		const eth = (window as any).ethereum;
		if (!eth) return;

		try {
			const sel = (eth as any).selectedAddress;
			if (sel && /^0x[a-fA-F0-9]{40}$/.test(sel)) setAccount(sel);
			const ch = (eth as any).chainId; // 可能是 '0x2105' 或数字
			if (typeof ch === "string") setChainId(parseInt(ch, 16));
			else if (typeof ch === "number") setChainId(ch);
		} catch {}

		const onAcc = (accs: string[]) => {
			setAccount(accs?.[0] || "");
		}

		const onChain = (hex: string) => {
			setChainId(parseInt(hex, 16));
		}
		eth.on?.("accountsChanged", onAcc);
		eth.on?.("chainChanged", onChain);

		 const onWConnected = async (e: any) => {
			const accs = e?.detail?.account || ""
			setAccount(accs)
			const chainID = typeof e?.detail?.chainId === "number" ? e.detail.chainId : null
			setChainId(chainID);
			setWalletProvider(e?.detail?.provider)
			// if (chainID !== 8453 ) {
			// 	try {
			// 		await eth.request({
			// 			method: "wallet_switchEthereumChain",
			// 			params: [{ chainId: 8453 }], // Base Mainnet
			// 		});
	        //    		setChainId(8453);
			// 	} catch (err) {
			// 	// 用户拒绝或钱包不支持时，保留原链，但后面会走公共 RPC 回退
			// 	}
			// }
			setOptedIn(true);
			refreshBalances()
		};

		const onWAcc = (e: any) => {
			const accs = e?.detail?.account || ""
			setAccount(accs)
			refreshBalances()
		};

		const onWDisc = () => {
			setAccount("");
			setChainId(null);
		};
		
		window.addEventListener("wallet:connected", onWConnected as any);
		window.addEventListener("wallet:accountsChanged", onWAcc as any);
		// window.addEventListener("wallet:chainChanged", onWChain as any);
		window.addEventListener("wallet:disconnected", onWDisc as any);

		return () => {
			eth.removeListener?.("accountsChanged", onAcc);
			eth.removeListener?.("chainChanged", onChain);
			window.removeEventListener("wallet:connected", onWConnected as any);
			window.removeEventListener("wallet:accountsChanged", onWAcc as any);
			// window.removeEventListener("wallet:chainChanged", onWChain as any);
			window.removeEventListener("wallet:disconnected", onWDisc as any);
		};
	}, []);

	const listening = async () => {
		baseProvider.on('block', block => {
			// 用 ref 做节流，避免闭包读到旧的 currectBlock
			if (block <= currectBlockRef.current) return
			currectBlockRef.current = block
			if (block % 5) return

			fetchPresaleStatus()
			refreshBalances()
			
		})
	}

	
	// Listen new block headers to refresh balances dynamically
	useEffect(() => {
		const eth = providerRef.current;
		if (!eth?.request || !account || !optedIn || !isApprovedProvider(eth)) return;


		let unsub: (() => void) | undefined;
		let subId: string | null = null;

		return () => {
			if (unsub) unsub();
		};
	}, [account, chainId]);

  // ---------- CTA handlers ----------
  const goMint = (amount: number) => {
	setAmountInput((0.01).toFixed(2))
	signEIP3009Authorization()
  }

  const goReceipts = () => {
    window.location.href = "https://www.x402scan.com/";
  };

  const goDOC = () => {
	window.location.href = "https://doc.settleonbase.xyz";
  }

  return (
    <div
      className="retro-theme min-h-screen font-mono text-[var(--crt-text)] bg-[var(--crt-bg)] overflow-x-hidden"
      data-testid="settle-landing"
    >
      <style>{`
        /* ==========================
           CRT / Retro Terminal Theme
        ========================== */
        .retro-theme {
          --crt-bg:#0a0d0a;
          --crt-panel:#111711;
          --crt-panel-solid:#0f140f;
          --crt-border:rgba(49,255,122,.4);
          --crt-border-strong:rgba(49,255,122,.8);
          --crt-text:#d9ffd9;
		  --crt-text-rgb:217 255 217;   /* 用于带 alpha 的文本色 */
          --crt-dim:#6b8f6b;
		  --crt-dim-rgb:107 143 107;    /* 用于带 alpha 的次要色 */
          --crt-accent:#31ff7a;
          --crt-shadow:0 0 8px rgba(49,255,122,.4),0 0 32px rgba(49,255,122,.15);
		  /* 兜底，防止类名被清理时整页变黑/白 */
		  color: var(--crt-text);
		  background: var(--crt-bg);
        }

        /* subtle CRT scanlines + radial vignette */
        .crt-shell {
          position:relative;
          background-color:var(--crt-bg);
          background-image:
            radial-gradient(circle at 50% 30%,rgba(49,255,122,.08)0%,rgba(0,0,0,0)70%),
            repeating-linear-gradient(
              to bottom,
              rgba(255,255,255,0) 0px,
              rgba(255,255,255,0) 2px,
              rgba(0,0,0,.3) 3px
            );
          background-size:100% 100%,100% 3px;
        }
        .crt-shell:after{
          content:"";
          position:absolute;
          inset:0;
          pointer-events:none;
          box-shadow:inset 0 0 120px rgba(0,0,0,.9);
        }

        /* grid backdrop like old terminal panes */
        .bg-grid{
          background-image:
            linear-gradient(rgba(49,255,122,.07) 1px,transparent 1px),
            linear-gradient(90deg,rgba(49,255,122,.07) 1px,transparent 1px);
          background-size:24px 24px;
          background-position:0 0;
          position:relative;
        }

        /* ticker: feels like system log */
        @keyframes marquee {
          0% { transform:translateX(0%); }
          100% { transform:translateX(-50%); }
        }
        .ticker-track {
          white-space:nowrap;
          display:flex;
		  gap:24px;
		  min-width:100%;
		  will-change: transform;
          animation:marquee 18s linear infinite;
        }

        /* subtle boot-up rise */
        @keyframes rise {
          0% { transform:translateY(16px); opacity:0; }
          100% { transform:translateY(0); opacity:1; }
        }
        .animate-rise {
          animation:rise .5s cubic-bezier(.16,1,.3,1) both;
        }

        /* flicker accent */
        @keyframes flicker {
          0%,100%{opacity:1;}
          50%{opacity:.4;}
        }
        .flicker-soft{
          animation:flicker 2s steps(2,end) infinite;
        }

        /* terminal style card */
        .term-card{
          background-color:var(--crt-panel);
          border:1px solid var(--crt-border);
          border-radius:6px;
          box-shadow:var(--crt-shadow);
          text-shadow:0 0 4px rgba(49,255,122,.4);
		  max-width:100%;
		  overflow:hidden;
        }

        .term-header{
          background-color:rgba(0,0,0,.4);
          border-bottom:1px solid var(--crt-border);
          font-size:10px;
          line-height:1rem;
          text-transform:uppercase;
          color:var(--crt-accent);
          padding:.25rem .5rem;
          display:flex;
          align-items:center;
          justify-content:space-between;
          letter-spacing:.05em;
        }

        /* nav bar */
        .nav-bar{
          background-color:var(--crt-panel);
          border:1px solid var(--crt-border);
          border-radius:6px;
          box-shadow:var(--crt-shadow);
          padding:.5rem .75rem;
          display:flex;
          align-items:center;
          justify-content:space-between;
          position:sticky;
          top:1rem;
          z-index:30;
        }
        .nav-brand{
          display:flex;
          align-items:center;
          gap:.5rem;
          font-size:12px;
          color:var(--crt-text);
          line-height:1.1;
        }
        .nav-chip{
          border:1px solid var(--crt-border);
          border-radius:4px;
          padding:0 .4rem;
          color:var(--crt-accent);
          font-size:10px;
          box-shadow:0 0 6px var(--crt-accent);
        }

        .nav-links button,
        .nav-links a{
          font-size:11px;
          line-height:1rem;
          color:var(--crt-text);
          text-shadow:0 0 4px rgba(49,255,122,.4);
          background:rgba(0,0,0,.4);
          border:1px solid var(--crt-border);
          border-radius:4px;
          padding:.4rem .5rem;
        }
        .nav-links button:hover,
        .nav-links a:hover{
          background:rgba(49,255,122,.08);
          box-shadow:0 0 8px var(--crt-accent);
          color:var(--crt-accent);
        }

        /* main headline */
        .heading-crt{
          color:var(--crt-accent);
          text-shadow:0 0 4px var(--crt-accent),0 0 12px rgba(49,255,122,.6);
          font-weight:600;
          letter-spacing:-.03em;
          line-height:1.1;
        }

        /* tiny helper label */
        .label-line{
          color:var(--crt-dim);
          font-size:10px;
          line-height:1rem;
          letter-spacing:.06em;
          text-transform:uppercase;
          display:flex;
          align-items:center;
          gap:.5rem;
        }
        .label-dot{
          height:6px;
          width:6px;
          border-radius:9999px;
          background-color:var(--crt-accent);
          box-shadow:0 0 6px var(--crt-accent);
        }

        /* pricing cards: inherit term-card but tighten */
        .tier-card{
          background-color:var(--crt-panel);
          border:1px solid var(--crt-border);
          border-radius:6px;
          box-shadow:var(--crt-shadow);
          padding:1rem;
          text-shadow:0 0 4px rgba(49,255,122,.4);
        }

        .footer-links a{
          color:var(--crt-text);
          font-size:11px;
          text-decoration:none;
        }
        .footer-links a:hover{
          color:var(--crt-accent);
          text-shadow:0 0 4px var(--crt-accent);
        }
		  @media (max-width: 768px){
		  	.retro-theme, .crt-shell{ overflow-x:hidden; }
			.marquee-safe{ max-width:100%; overflow:hidden; }
			.hero-safe{ max-width:100%; overflow:hidden; }
			img{ max-width:100%; height:auto; display:block; }
		  }
			.section-safe{
				position: relative;
				width: 100%;
				max-width: 100vw;
				overflow-x: hidden;
			}
			.section-safe > .section-inner{
				margin-left: 0px;
				margin-right: 0px;
				width: 100%;
				max-width: 100vw;
			}
			@media (min-width: 768px){
				.section-safe > .section-inner{
					padding-left: 0;
					padding-right: 0;
				}

			}
			.section-safe .term-card{
				max-width: 100%;
				overflow: hidden;
			}
			.tab-green[data-state="active"]{
				background: var(--crt-accent) !important;
				color: var(--crt-bg) !important;                  /* 与 MINT 按钮一致的深色文字 */
				border-color: var(--crt-border-strong) !important;
				box-shadow: 0 0 12px var(--crt-accent) !important;
			}
      `}</style>

      {/* OUTER CRT SHELL */}
      <div className="crt-shell">
        {/* status bar / top banner */}
        <div className="w-full border-b border-[var(--crt-border)] bg-[var(--crt-panel)] px-4 py-2 text-[10px] text-[var(--crt-text)] flex items-center justify-between font-mono tracking-wide">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--crt-accent)] flex items-center gap-1">
              <Gauge className="h-3 w-3" /> STATUS
            </span>
            <span>protocol:</span>
            <Badge
              variant="secondary"
              className="bg-transparent border border-[var(--crt-border)] text-[10px] font-mono leading-none px-2 py-1 text-[var(--crt-accent)] shadow-[0_0_6px_var(--crt-accent)]"
              data-testid="protocol-badge"
            >
              {protocolBadgeText(protocol)}
            </Badge>
          </div>
          <div className="text-[var(--crt-dim)]">last_update={lastUpdated}</div>
        </div>

        {/* NAV */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto mt-4 nav-bar"
        >
          <div className="nav-brand">
            <div
              className="h-8 w-8 flex items-center justify-center border border-[var(--crt-border)] rounded-[4px] text-[var(--crt-accent)] text-xs font-bold shadow-[0_0_8px_var(--crt-accent)]"
            >
              <img src = {logo} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[var(--crt-text)] text-[11px] font-semibold tracking-wide">
                SETTLE // BASE
              </span>
              <span className="text-[10px] text-[var(--crt-dim)] leading-none">
                gasless by x402
              </span>
            </div>
            <span className="nav-chip">ONLINE</span>
          </div>

          <div className="nav-links flex items-center gap-2">
            <button onClick={goDOC}>
              DOCS
            </button>
            <button onClick={goReceipts}>X402.SCAN</button>
            <ConnectWallet />
          </div>
        </motion.nav>

        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-4 py-10 md:py-14 md:grid md:grid-cols-2 md:gap-10 items-start text-[var(--crt-text)] overflow-x-hidden">
          <div className="space-y-6 min-w-0">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="heading-crt text-3xl md:text-5xl"
            >
              MINTS THAT SETTLE_
              <br className="hidden md:block" />
              <span className="text-[var(--crt-text)]">ON BASE</span>
            </motion.h1>

            <div className="text-[11px] md:text-sm leading-relaxed text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono">
              <span className="text-[var(--crt-accent)]">x402</span> is a settlement layer that lets any wallet finalize a real transaction on Base with 0 gas paid by the user — with auto‑retry and a guaranteed outcome.
              <br />
              <br />
              <span className="text-[var(--crt-accent)]">$SETTLE</span> is the first public live-fire run of that settlement layer. Connect wallet, join the Mint/Early Access in USDC, and feel it yourself: gasless submit, automatic retry, and a shareable on-chain receipt at <span className="text-[var(--crt-accent)]">x402.scan</span>.
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick= {() => {
					document.getElementById('mint-section')
      				?.scrollIntoView({ behavior: 'smooth', block: 'start' })

				}}
                className="text-[11px] leading-none font-semibold text-[var(--crt-bg)] bg-[var(--crt-accent)] border border-[var(--crt-border-strong)] rounded-[4px] px-3 py-2 shadow-[0_0_12px_var(--crt-accent)] hover:brightness-110 hover:shadow-[0_0_20px_var(--crt-accent)]"
              >
                CONNECT WALLET & MINT
              </button>
              <button
                onClick={goReceipts}
                className="text-[11px] leading-none text-[var(--crt-text)] bg-[rgba(0,0,0,.4)] border border-[var(--crt-border)] rounded-[4px] px-3 py-2 hover:bg-[rgba(49,255,122,.08)] hover:text-[var(--crt-accent)] hover:shadow-[0_0_12px_var(--crt-accent)]"
              >
                VIEW TX RECEIPTS
              </button>
            </div>

            {/* live ticker / system log */}
			<section className="section-safe min-w-0">
				<div className="section-inner">
					<div className="marquee-safe overflow-hidden border border-[var(--crt-border)] rounded-[4px] bg-[var(--crt-panel)] shadow-[0_0_8px_var(--crt-accent)]">
						<div className="ticker-track text-[10px] md:text-[11px] flex gap-6 text-[rgb(var(--crt-text-rgb)_/_0.7)] px-3 py-2">
							<div className="flex items-center gap-2 whitespace-nowrap">
							<ShieldCheck className="h-3 w-3 text-[var(--crt-accent)]" />
							<span>fee=0.01% gasless</span>
							</div>
							<div className="flex items-center gap-2 whitespace-nowrap">
							<Zap className="h-3 w-3 text-[var(--crt-accent)]" />
							<span>tiers:[1U|10U|100U]</span>
							</div>
							<div className="flex items-center gap-2 whitespace-nowrap">
							<Gauge className="h-3 w-3 text-[var(--crt-accent)]" />
							<span>success≥{success24h}</span>
							</div>
							<div className="flex items-center gap-2 whitespace-nowrap">
							<Hourglass className="h-3 w-3 text-[var(--crt-accent)]" />
							<span>p95={p95}</span>
							</div>
							<div className="flex items-center gap-2 whitespace-nowrap">
							<LinkIcon className="h-3 w-3 text-[var(--crt-accent)]" />
							<span>audit→x402.scan</span>
							</div>
						</div>
					</div>
				</div>
			</section>


            {/* stats inline */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <Stat
                label={"24h success rate"}
                value={success24h}
                sub={"precheck rejects are not counted as failures"}
              />
              <Stat
                label={"P95 to receipt"}
                value={p95}
                sub={"click → x402.scan"}
              />
              <Stat
                label={"receipt coverage"}
                value={"100%"}
                sub={"success or clear reason"}
              />
            </div>
          </div>

          {/* hero visual side */}
		  <section className="section-safe">
			<div className="section-inner">
				<div className="space-y-4">
					{/* WALLET DASHBOARD (only when connected) */}
					{account && (
						<div className="term-card p-3">
							<div className="term-header">
								<span>WALLET.DASHBOARD</span>
								<span className="text-[var(--crt-dim)]">
									{chainId ? `BASE Mainnet` : "READONLY"}
								</span>
							</div>
							<div className="p-3">
								<div className="text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] mb-3 flex items-center gap-2">
									<span className="text-[var(--crt-accent)]">ADDR</span>
									<span className="truncate max-w-[16rem] md:max-w-[22rem]">
										{account.slice(0, 6)}…{account.slice(-4)}
									</span>
								</div>
								<div className="grid grid-cols-2 gap-4 md:gap-6">
									<Stat label="USDC" value={usdcBalance}/>

									<div className="flex justify-end">
										<Stat
											label={<span className="block text-right">{EIP3009.SETTLE_symbol}</span>}
											value={
											<span className="block text-right whitespace-nowrap">
												{sobBalance}
												<span className="text-xs opacity-70 ml-1">/ {sobPaddingBalance}</span>
											</span>
											}
										/>
									</div>
									
								</div>
							</div>
						</div>
					)}
					
					<div className="term-card hero-safe p-0">
						<div className="term-header">
							<div className="flex items-center gap-2 text-[10px] md:text-xs">
								

								{/* 目前 mint 状态：padding 或 正式 mint */}
								<span className="px-2 py-1 rounded border border-[var(--crt-border)] bg-[rgba(0,0,0,.4)] text-[var(--crt-accent)]">
								STATE: {isPedding ? "padding" : "mint"}
								</span>

								{/* 累计 mint 次数（合约返回的 pendingMintsCountTotal） */}
								<span className="px-2 py-1 rounded border border-[var(--crt-border)] bg-[rgba(0,0,0,.4)] text-[var(--crt-text)]">
								COUNT: {preMintCount}
								</span>

								{/* SETTLE数 / padding数：左侧用当前 feed 的合计，右侧用合约 pendingAmount */}
								<span className="px-2 py-1 rounded border border-[var(--crt-border)] bg-[rgba(0,0,0,.4)] text-[var(--crt-text)]">
								SETTLE/PADDING: {totalSupply} / {pendingAmount}
								</span>

								{/* USDC 总数：合约 totalUSDC */}
								<span className="px-2 py-1 rounded border border-[var(--crt-border)] bg-[rgba(0,0,0,.4)] text-[var(--crt-text)]">
								USDC: {totalUSDC}
								</span>
							</div>
						</div>

						<div className="p-2 h-64 md:h-80 overflow-auto will-change-transform will-change-opacity">
							{/* 使用 layout + AnimatePresence：插入到顶部时旧行下移，新行淡入 */}
							<motion.ul
								layout="position"
								initial={false}
								transition={{
									layout: { duration: 0.1, ease: [0.16, 1, 0.3, 1] }
								}}
							>
							
								{liveData.map((row, i) => {
									const rowKey = row.tx && row.tx.length > 0 ? row.tx : (row as any).__kid;
									const isFlash = rowKey === flashKey;
									return (
								<motion.li
										key={rowKey}
										layout="position"
										// 只有“刚插入的那一行”做 0.5s 的明暗闪耀；其它行不动透明度/亮度
										animate={
											isFlash
												? { filter: ["brightness(2)", "brightness(0.8)", "brightness(1)"] }
												: { filter: "brightness(1)" }
										}
										transition={{
											// 位置下移：旧行只做 0.1s 位移动画
											layout: { duration: 0.1, ease: [0.16, 1, 0.3, 1] },
												// 闪耀：仅新行触发，0.5s，总时长内前 0.01s 高亮（0.5 * 0.02）
											duration: isFlash ? 0.5 : 0,
											times: isFlash ? [0, 0.02, 1] : undefined,
												ease: [0.16, 1, 0.3, 1],
										}}
									className="grid grid-cols-[1fr_auto] items-center gap-2 py-2 px-2 border-b border-[rgba(49,255,122,.15)] text-[10px] md:text-xs"
								>
									<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										<span className="text-[var(--crt-accent)] font-semibold">
										+{row.amount} SETTLE
										</span>
										<span className="text-[var(--crt-dim)]">/ {row.usdc} USDC</span>
									</div>
									<div className="text-[rgb(var(--crt-text-rgb)_/_0.8)] truncate">
										{short(row.address)} · {short(row.tx, 10, 6)}
									</div>
									</div>

									<a
										className="justify-self-end text-[var(--crt-accent)] hover:underline"
										href={`https://sepolia.basescan.org/tx/${row.tx}`}
										target="_blank"
										rel="noreferrer"
										title="View on x402.scan"
									>
									VIEW
									</a>
								</motion.li>
								)})}
							</motion.ul>
						</div>
						</div>

					<Card className="term-card animate-rise">
						<div className="term-header">
							<span>x402 settlement flow (real pipeline preview)</span>
							<span className="text-[var(--crt-dim)]">READONLY</span>
						</div>
						<CardContent className="p-4">
							<div className="space-y-3 text-[10px] md:text-xs leading-relaxed">
							<div className="flex items-start gap-2 text-[var(--crt-text)]">
								<Hourglass className="h-3 w-3 text-[var(--crt-accent)]" />
								<span>precheck → broadcast → waiting for receipt</span>
							</div>
							<div className="flex items-start gap-2 text-green-400">
								<CheckCircle2 className="h-3 w-3" />
								<span>SETTLED ✓</span>
							</div>
							<div className="flex items-start gap-2 text-[var(--crt-dim)]">
								<LinkIcon className="h-3 w-3" />
								<span>x402.scan/tx/0x… (shareable)</span>
							</div>
							<div className="flex items-start gap-2 text-[var(--crt-text)]">
								<RefreshCcw className="h-3 w-3 text-[var(--crt-accent)]" />
								<span>auto‑retry on degraded network</span>
							</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		  </section>
          
        </section>

        {/* TOKEN TIERS */}
        <section id="mint-section" className="max-w-6xl mx-auto px-4 py-10 scroll-mt-24">
          <Card className="term-card animate-rise">
            <div className="term-header">
              <span>MINT.$SETTLE</span>
              <span className="text-[var(--crt-dim)]">USDC-&gt;$SETTLE Mint / Early Access</span>
            </div>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { t: "Starter", u: 1, s: "For first touch" },
                  { t: "Growth", u: 10, s: "For ongoing entry" },
                  { t: "Pro", u: 100, s: "For larger commitment" },
                ].map((p) => (
                  <div
                    key={p.t}
                    className="tier-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[var(--crt-accent)] font-semibold text-xs">{p.t}</div>
                      <div className="text-xl font-semibold text-[var(--crt-accent)] drop-shadow-[0_0_6px_var(--crt-accent)]">{p.u} USDC</div>
                      <div className="text-[10px] text-[var(--crt-dim)] leading-relaxed mt-1">
                        $SETTLE Mint / Early Access · Gasless on Base
                      </div>
                    </div>

                    <button
                      className="w-full mt-4 text-[10px] leading-none font-semibold text-[var(--crt-bg)] bg-[var(--crt-accent)] border border-[var(--crt-border-strong)] rounded-[4px] px-3 py-2 shadow-[0_0_12px_var(--crt-accent)] hover:brightness-110 hover:shadow-[0_0_20px_var(--crt-accent)]"
                      data-testid={`mint-${p.u}u`}
                      onClick={() => {
						goMint(p.u)
					  }}
                    >
                      MINT {p.u}U
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[var(--crt-dim)] mt-4 leading-relaxed">
                Fixed price examples (adjustable in admin). Every mint produces an x402.scan receipt.
              </p>
            </CardContent>
          </Card>
        </section>
        {/* WHAT IS $SETTLE */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <Card className="term-card animate-rise">
            <div className="term-header">
              <span>WHAT IS $SETTLE</span>
              <span className="text-[var(--crt-dim)]">READ FIRST</span>
            </div>
            <CardContent className="p-4 grid md:grid-cols-3 gap-6 text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono leading-relaxed">
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs mb-1">1. Live fire, not slideware</div>
                <p>
                  $SETTLE is the public stress test for the x402 settlement layer. Every purchase is a real USDC settlement on Base. x402 fronts gas, auto‑retries, and delivers a verifiable receipt (x402.scan). This is not a deck — it’s proof the infra already runs in production conditions.
                </p>
              </div>
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs mb-1">2. Anyone can feel it</div>
                <p>
                  You don’t have to learn RPCs, gas, or network switching. Bring a wallet and a little USDC, pick 1U / 10U / 100U, sign once. You literally feel what x402 sells: “click, asset delivered, receipt you can prove.”
                </p>
              </div>
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs mb-1">3. Settlement layer as an economic surface</div>
                <p>
                  $SETTLE is also how we expose x402’s settlement guarantees — priority lanes, higher success rates, IRL drops that don’t stall — as something partners can buy, meter, and integrate. Launchpads, wallets, brands can plug into the same channel.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* WHY SETTLE / PROBLEM SPACE */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <Card className="term-card animate-rise">
            <div className="term-header">
              <span>Why x402 exists</span>
              <span className="text-[var(--crt-dim)]">$SETTLE = public demo</span>
            </div>
            <CardContent className="p-4 grid md:grid-cols-3 gap-6 text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono leading-relaxed">
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs mb-1">1. Normal people can't get in</div>
                <p>
                  They’re told to get gas, switch RPC, pray it doesn’t hang pending. Most quit on step one. Support melts down instantly.
                </p>
              </div>
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs mb-1">2. Launches keep breaking</div>
                <p>
                  Teams try to sell tokens / access / Mint / Early Access, but end up live-teaching “buy ETH for gas, change network, screenshot your txhash.” Conversion dies.
                </p>
              </div>
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs mb-1">3. x402 = the settlement layer</div>
                <p>
                  We drop a settlement layer on Base: we front gas, auto‑retry, and issue a standard receipt. Users can one-click into $SETTLE while experiencing the actual infra. The $SETTLE Mint / Early Access <em>is</em> the public demonstration of that capability.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <Card className="term-card animate-rise">
            <div className="term-header">
              <span>How to join (Mint / Early Access)</span>
              <span className="text-[var(--crt-dim)]">NO GAS NEEDED</span>
            </div>
            <CardContent className="p-4 grid md:grid-cols-3 gap-6">
              <Step
                n={1}
                title="Pick a tier"
                body="Choose 1U / 10U / 100U — Mint / Early Access, no whitelist."
              />
              <Step
                n={2}
                title="Sign once"
                body="Sign to trigger the trade. x402 pays gas on Base and routes through the healthiest path."
              />
              <Step
                n={3}
                title="Get your receipt"
                body="Instant shareable x402.scan receipt: settled, or a clear reason + next step."
              />
            </CardContent>
          </Card>
        </section>

        {/* STATUS + PROTOCOL */}
        <section className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-6">
          <Card className="term-card animate-rise">
            <div className="term-header">
              <span>SLO.METRICS</span>
              <span className="text-[var(--crt-dim)]">LIVE</span>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <Stat label="last 60m success" value={success24h} />
                <Stat label="P95 to receipt" value={p95} />
                <Stat label="errors w/ reason" value="100%" />
              </div>
              <p className="text-[10px] text-[var(--crt-dim)] mt-4 leading-relaxed">
                metrics auto‑refresh /15s when /api/status is available.
              </p>
            </CardContent>
          </Card>

          <Card className="term-card animate-rise">
            <div className="term-header">
              <span>X402.PROTOCOL_CHANNEL</span>
              <span className="text-[var(--crt-dim)]">STATE={protocol}</span>
            </div>
            <CardContent className="p-4">
              <Tabs defaultValue={protocol.toLowerCase()}>
                <TabsList className="grid grid-cols-3 gap-2 bg-transparent p-0 border-0">
                  <TabsTrigger
                    value="available"
                    className="tab-green text-[9px] leading-none text-[var(--crt-text)] bg-[rgba(0,0,0,.4)] border border-[var(--crt-border)] rounded-[4px] px-2 py-2"
                  >
                    AVAILABLE
                  </TabsTrigger>
                  <TabsTrigger
                    value="rate_limit"
                    className="tab-green text-[9px] leading-none text-[var(--crt-text)] bg-[rgba(0,0,0,.4)] border border-[var(--crt-border)] rounded-[4px] px-2 py-2"
                  >
                    RATE_LIMIT
                  </TabsTrigger>
                  <TabsTrigger
                    value="window_closed"
                    className="tab-green text-[9px] leading-none text-[var(--crt-text)] bg-[rgba(0,0,0,.4)] border border-[var(--crt-border)] rounded-[4px] px-2 py-2"
                  >
                    WINDOW_CLOSED
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="available"
                  className="mt-4 text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono leading-relaxed"
                >
                  Gasless channel healthy. New submits should settle fast.
                </TabsContent>
                <TabsContent
                  value="rate_limit"
                  className="mt-4 text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono leading-relaxed"
                >
                  Protocol is rate-limited. We\'ll queue + retry automatically; short delays possible.
                </TabsContent>
                <TabsContent
                  value="window_closed"
                  className="mt-4 text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono leading-relaxed"
                >
                  Gasless window closed. Check announcements or try later (or fall back to self-pay mode).
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="term-card animate-rise">
              <div className="term-header">
                <span>FAQ.FAILURE</span>
                <span className="text-[var(--crt-dim)]">TRACE</span>
              </div>
              <CardContent className="p-4 text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono leading-relaxed space-y-3">
                <p>
                  Most predictable failures are intercepted before submit. If it still fails, the receipt tells you exactly why and what to do next:
                </p>
                <ul className="space-y-2 list-disc ml-5">
                  <li>
                    <span className="text-[var(--crt-accent)] font-semibold">X402‑RATE‑LIMIT</span> — protocol rate-limited, we queue and auto‑retry
                  </li>
                  <li>
                    <span className="text-[var(--crt-accent)] font-semibold">X402‑WINDOW‑CLOSED</span> — gasless window is temporarily closed
                  </li>
                  <li>
                    <span className="text-[var(--crt-accent)] font-semibold">PRECHECK‑INVALID</span> — signature window / nonce / domain invalid (caught pre-submit)
                  </li>
                  <li>
                    <span className="text-[var(--crt-accent)] font-semibold">RPC‑DEGRADED</span> — network path degraded, we switched and retried
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="term-card animate-rise">
              <div className="term-header">
                <span>FAQ.SUCCESS</span>
                <span className="text-[var(--crt-dim)]">VERIFY</span>
              </div>
              <CardContent className="p-4 text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono leading-relaxed space-y-3">
                <p>
                  You get a shareable <span className="text-[var(--crt-accent)] font-semibold">x402.scan</span> receipt with tx hash, block, timestamp, and Base explorer link. Final status:
                  <span className="text-[var(--crt-accent)] font-semibold"> SETTLED</span>.
                </p>
                <p>
                  You do not need gas in your wallet — gas is fronted by the
                  <span className="text-[var(--crt-accent)] font-semibold"> x402 protocol on Base</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <Card className="term-card animate-rise">
            <div className="term-header">
              <span>Who uses this settlement layer</span>
              <span className="text-[var(--crt-dim)]">plug-in ready</span>
            </div>
            <CardContent className="p-4 grid md:grid-cols-4 gap-6 text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] font-mono leading-relaxed">
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs">Launchpads</div>
                <p className="mt-1">
                  Make x402 your sale backend. User clicks and actually gets the asset — not a 30‑minute pending purgatory.
                </p>
              </div>
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs">Mint sites</div>
                <p className="mt-1">
                  Add gasless mint + verifiable receipt. Support no longer has to answer “where did my money go?”
                </p>
              </div>
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs">Wallet components</div>
                <p className="mt-1">
                  We front gas / handle rate limits / auto‑retry. You don’t have to duct-tape every weird RPC edge case.
                </p>
              </div>
              <div>
                <div className="text-[var(--crt-accent)] font-semibold text-xs">Brands / live activations</div>
                <p className="mt-1">
                  IRL drops, livestream giveaways, promo moments — user walks away already holding the asset, not “check back later.” Priority lanes available.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* B2B PRICING */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <Card className="term-card animate-rise">
            <div className="term-header">
              <span>PRICING.B2B</span>
              <span className="text-[var(--crt-dim)]">USD</span>
            </div>
            <CardContent className="p-4">
              <p className="text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.7)] font-mono leading-relaxed mb-6">
                x402 is a settlement layer you can embed. Below are the standard plans for launchpads / wallets / brands / large issuers.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="tier-card text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] leading-relaxed">
                  <div className="text-[var(--crt-accent)] font-semibold text-xs mb-2">
                    Per Tx (Usage)
                  </div>
                  <div>$0.005–$0.02 / tx or 0.15%–0.35% (capped). Only charged on successful settlement.</div>
                </div>

                <div className="tier-card text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] leading-relaxed">
                  <div className="text-[var(--crt-accent)] font-semibold text-xs mb-2">
                    Pro (SaaS)
                  </div>
                  <div>$499 / month + 0.2% / tx. Includes failure triage, webhooks, white‑label receipts, quota management.</div>
                </div>

                <div className="tier-card text-[10px] md:text-xs text-[rgb(var(--crt-text-rgb)_/_0.8)] leading-relaxed">
                  <div className="text-[var(--crt-accent)] font-semibold text-xs mb-2">
                    Enterprise
                  </div>
                  <div>Custom SLA, dedicated routing, compliance logs / KYT, priority lane allocation. Volume-based.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>



        {/* FOOTER */}
        <footer className="max-w-6xl mx-auto px-4 py-12 text-[var(--crt-text)]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 flex items-center justify-center border border-[var(--crt-border)] rounded-[4px] text-[var(--crt-accent)] text-[11px] font-bold shadow-[0_0_8px_var(--crt-accent)]">
                <img src={logo} className="h-full w-full object-contain block" />
              </div>
              <div className="leading-tight text-[10px] md:text-xs">
                <div className="text-[var(--crt-accent)] font-semibold text-xs">Settle</div>
                <div className="text-[rgb(var(--crt-text-rgb)_/_0.8)]">Gasless by x402 Protocol on Base</div>
              </div>
            </div>

            <div className="footer-links flex flex-col md:flex-row md:items-start gap-2 md:gap-4 font-mono">
              <a href="/terms">TERMS</a>
              <a href="/privacy">PRIVACY</a>
              <a href="/status">STATUS</a>
              <a href="https://www.x402scan.com/">X402.SCAN</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
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
