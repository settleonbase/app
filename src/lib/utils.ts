/* ============================
   src/lib/utils.ts (inline)
============================ */

import { pickByRDNS } from "../lib/eip6963";

export function cn(...args: Array<string | undefined | null | false>) {
  return args.filter(Boolean).join(" ")
}

type WalletKind = "metamask" | "coinbase" | "okx";

const RDNS_MAP: Record<WalletKind, string[]> = {
  metamask: ["io.metamask", "io.metamask.flask"],
  coinbase: ["com.coinbase.wallet", "com.coinbase.wallet.extension"],
  okx: ["com.okex.wallet", "com.okx.wallet"],
};

export type EIP1193Provider = {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  request: (args: { method: string; params?: any[] | object }) => Promise<any>;
  on?: (event: string, cb: (...args: any[]) => void) => void;
  removeListener?: (event: string, cb: (...args: any[]) => void) => void;
};

export function getInjectedProvider(kind: WalletKind): EIP1193Provider | undefined {
  const { ethereum, coinbaseWalletExtension } = window;

  // A) EIP-6963
  const byRdns = pickByRDNS(RDNS_MAP[kind] || []);
  if (byRdns) return byRdns;

  // B) 多注入 providers
  if (ethereum?.providers && Array.isArray(ethereum.providers)) {
	const pick = (ethereum.providers as any[]).find((p: any) => {
	  if (kind === "metamask") return !!p.isMetaMask;
	  if (kind === "coinbase") return !!p.isCoinbaseWallet;
	  if (kind === "okx") return !!p.isOkxWallet;
	  return false;
	});
	if (pick) return pick as EIP1193Provider;
  }

  // C) 单 provider
  if (ethereum) {
	if (kind === "metamask" && (ethereum as any).isMetaMask) return ethereum;
	if (kind === "coinbase" && (ethereum as any).isCoinbaseWallet) return ethereum;
	if (kind === "okx" && (ethereum as any).isOkxWallet) return ethereum;
  }

  // D) coinbaseWalletExtension
  if (kind === "coinbase" && coinbaseWalletExtension?.isCoinbaseWallet) {
	return coinbaseWalletExtension as unknown as EIP1193Provider;
  }

  // E) Trust Wallet 假阳性兜底
  // @ts-ignore
  if ((window.ethereum as any)?.isTrust) return undefined;

  return undefined;
}