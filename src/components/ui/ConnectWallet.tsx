// src/components/ConnectWallet.tsx
import React, { useMemo, useRef, useState } from "react";
import metamask_icon from "./assets/metamask-icon.svg";
import coinbase_icon from "./assets/coinbase-icon.svg";
import okx_icon from "./assets/okx-icon.png";
import { pickByRDNS } from "../../lib/eip6963";



type EIP1193Provider = {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  request: (args: { method: string; params?: any[] | object }) => Promise<any>;
  on?: (event: string, cb: (...args: any[]) => void) => void;
  removeListener?: (event: string, cb: (...args: any[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EIP1193Provider & { providers?: EIP1193Provider[] };
    coinbaseWalletExtension?: { isCoinbaseWallet?: boolean } & EIP1193Provider;
  }
}

type WalletKind = "metamask" | "coinbase" | "okx";

function emitWalletEvent(type: string, detail?: any) {
  try {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  } catch {}
}

const RDNS_MAP: Record<WalletKind, string[]> = {
  metamask: ["io.metamask", "io.metamask.flask"],
  coinbase: ["com.coinbase.wallet", "com.coinbase.wallet.extension"],
  okx: ["com.okex.wallet", "com.okx.wallet"],
};

function getInjectedProvider(kind: WalletKind): EIP1193Provider | undefined {
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

function shortAddr(addr?: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

const BASE_CHAIN_ID = "0x2105"; // Base Mainnet

export default function ConnectWallet() {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState<WalletKind | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentKind, setCurrentKind] = useState<WalletKind | null>(null);

  // 当前 provider 与监听器引用，便于断开时移除
  const providerRef = useRef<EIP1193Provider | null>(null);
  const onAccountsChangedRef = useRef<((accs: string[]) => void) | null>(null);
  const onChainChangedRef = useRef<((cid: string) => void) | null>(null);

  const metaMaskInjected = useMemo(
    () => Boolean(getInjectedProvider("metamask")),
    [open]
  );
  const coinbaseInjected = useMemo(
    () => Boolean(getInjectedProvider("coinbase")),
    [open]
  );

  function detachListeners() {
    const provider = providerRef.current;
    if (!provider) return;
    if (onAccountsChangedRef.current) {
      provider.removeListener?.("accountsChanged", onAccountsChangedRef.current);
    }
    if (onChainChangedRef.current) {
      provider.removeListener?.("chainChanged", onChainChangedRef.current);
    }
    onAccountsChangedRef.current = null;
    onChainChangedRef.current = null;
  }

  function disconnect() {
    // 仅清本地状态 + 移除监听。浏览器扩展侧并没有标准的“程序化断开”接口。
    detachListeners();
    providerRef.current = null;
    setAddress(null);
    setChainId(null);
    setCurrentKind(null);
    setError(null);
    emitWalletEvent("wallet:disconnected", {});
  }

  async function connect(kind: WalletKind) {
    setError(null);

    // 若已连接了其它类型，提示先断开
    if (address && currentKind && currentKind !== kind) {
      disconnect();
    }

    setConnecting(kind);
    try {
      const provider = getInjectedProvider(kind);
      if (!provider) {
        if (kind === "metamask") {
          window.open("https://metamask.io/download/", "_blank");
        } else if (kind === "coinbase") {
          window.open("https://www.coinbase.com/wallet", "_blank");
        } else {
          window.open("https://www.okx.com/download", "_blank");
        }
        return;
      }

      // 若当前正连同类型，允许重复打开授权；若已连同类型，直接复用
      providerRef.current = provider;

      const accounts: string[] = await provider.request({
        method: "eth_requestAccounts",
      });

      // 读取当前链（不强制切换 / 添加链，尊重钱包已有配置）
      const cidHex: string = await provider.request({ method: "eth_chainId" });
      const isBase = cidHex === BASE_CHAIN_ID;

      setAddress(accounts?.[0] ?? null);
      setChainId(cidHex ?? null);
      setCurrentKind(kind);

      if (!isBase) {
        // 友好提示 + 不关闭弹窗；等待用户在钱包中手动切换
        //setError("请在钱包内切换到 Base 主网 (chainId 8453) 后再继续。");
        // emitWalletEvent("wallet:wrongNetwork", {
        //   chainId: cidHex ? parseInt(cidHex, 16) : null,
        //   required: 8453,
        //   kind,
        // });

		//Optional: Prompt the user to switch networks
      	await provider.request({
      		method: 'wallet_switchEthereumChain',
      		params: [{ chainId: '0x2105' }],
      	});

      } else {
        // 正确网络 → 正常完成连接
        setOpen(false);
        emitWalletEvent("wallet:connected", {
          account: accounts?.[0] ?? "",
          chainId: cidHex ? parseInt(cidHex, 16) : null,
          kind,
		  provider
        });
      }

      // 监听账号/网络变化
      const onAccountsChanged = (accs: string[]) => {
        const next = accs?.[0] ?? null;
        setAddress(next);
        emitWalletEvent("wallet:accountsChanged", { account: next || "" });

        // 如果扩展侧把账号清空，当作“断开”
        if (!next) {
          setChainId(null);
          setCurrentKind(null);
          providerRef.current = null;
          detachListeners();
        }
      };

      const onChainChanged = (newChainId: string) => {
        setChainId(newChainId ?? null);
        const n = newChainId ? parseInt(newChainId, 16) : null;
        emitWalletEvent("wallet:chainChanged", { chainId: n });

        // 如果用户从弹窗提示后切到了 Base，则清除错误并自动关闭弹窗
        // if (newChainId === BASE_CHAIN_ID) {
        //   setError(null);
        //   setOpen(false);
        //   emitWalletEvent("wallet:connected", {
        //     account: (address || "") as string,
        //     chainId: 8453,
        //     kind: currentKind,
        //   });
        // }
      };

      onAccountsChangedRef.current = onAccountsChanged;
      onChainChangedRef.current = onChainChanged;
      provider.on?.("accountsChanged", onAccountsChanged);
      provider.on?.("chainChanged", onChainChanged);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setConnecting(null);
    }
  }

  return (
    <div className="relative inline-block">
      {/* 触发按钮 */}
      {address ? (
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
          title={address}
        >
          Connected {shortAddr(address)}{" "}
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Connect Wallet
        </button>
      )}

      {/* 简易 Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#000000] border border-green-800 p-6 shadow-xl crt-text">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Wallet APP</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-sm px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3">
              {/* MetaMask */}
              <button
                disabled={connecting !== null}
                onClick={() => connect("metamask")}
                className="flex items-center justify-between rounded-xl border border-green-700 p-4 hover:border-green-400 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={metamask_icon}
                    alt="MetaMask"
                    className="w-8 h-8 rounded-md shadow-[0_0_0px_#00ff99]"
                  />
                  <div className="text-left text-green-400">
                    <div className="font-medium">MetaMask</div>
                    <div className="text-xs text-green-500">
                      {metaMaskInjected ? "已检测到浏览器扩展" : "未检测到，点击将跳转安装"}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-400">
                  {connecting === "metamask" ? "连接中…" : "连接"}
                </div>
              </button>

              {/* Coinbase Wallet */}
              <button
                disabled={connecting !== null}
                onClick={() => connect("coinbase")}
                className="flex items-center justify-between rounded-xl border border-green-700 p-4 hover:border-green-400 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={coinbase_icon}
                    alt="Coinbase Wallet"
                    className="w-8 h-8 rounded-md shadow-[0_0_1px_#00ff99]"
                  />
                  <div className="text-left text-green-400">
                    <div className="font-medium">Coinbase Wallet</div>
                    <div className="text-xs text-green-500">
                      {coinbaseInjected ? "已检测到浏览器扩展" : "未检测到，点击将跳转安装"}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-400">
                  {connecting === "coinbase" ? "连接中…" : "连接"}
                </div>
              </button>

              {/* OKX */}
              <button
                disabled={connecting !== null}
                onClick={() => connect("okx")}
                className="flex items-center justify-between rounded-xl border border-green-700 p-4 hover:border-green-400 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={okx_icon}
                    alt="OKX Wallet"
                    className="w-8 h-8 rounded-md shadow-[0_0_1px_#00ff99]"
                  />
                  <div className="text-left text-green-400">
                    <div className="font-medium">OKX Wallet</div>
                    <div className="text-xs text-green-500">
                      {Boolean((window.ethereum as any)?.isOkxWallet)
                        ? "已检测到浏览器扩展"
                        : "未检测到，点击将跳转安装"}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-400">
                  {connecting === "okx" ? "连接中…" : "连接"}
                </div>
              </button>
            </div>

            {/* 绿色 CRT 风格网络提示（当非 Base 时） */}
            {chainId && chainId !== BASE_CHAIN_ID && (
              <div className="mt-4 text-xs md:text-sm rounded-xl border border-green-700 bg-green-900/20 text-green-400 p-3 leading-relaxed">
                <div className="font-semibold tracking-wide">[ NETWORK NOTICE ]</div>
                <div className="mt-1">
                  当前网络 <span className="font-mono">{parseInt(chainId, 16)}</span>，需要切换到
                  <span className="font-mono ml-1">Base (8453)</span>。
                </div>
                <div className="mt-1 opacity-90">
                  请在你的钱包内打开「网络」→ 选择 <span className="font-mono">Base Mainnet</span>，切换后此窗口会自动关闭。
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 text-xs md:text-sm rounded-xl border border-red-700 bg-red-900/20 text-red-300 p-3 break-words">
                错误：{error}
              </div>
            )}

            {address && (
              <div className="mt-4 text-sm text-green-400">
                <div className="flex items-center gap-3 flex-wrap">
                  <span>
                    <span className="font-mono">{address}</span>
                  </span>
                  {chainId && (
                    <span>
                      Chain ID：<span className="font-mono">{parseInt(chainId, 16)}</span>
                    </span>
                  )}
                  <button
                    onClick={disconnect}
                    className="ml-auto px-2 py-1 rounded-md border border-green-700 text-green-400 hover:bg-green-900/30 transition"
                    title="断开当前钱包连接"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
