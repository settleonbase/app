// src/components/ConnectWallet.tsx
import React, { useMemo, useRef, useState, useEffect } from "react"
import metamask_icon from "../assets/metamask-icon.svg"
import coinbase_icon from "../assets/coinbase-icon.svg"
import okx_icon from "../assets/okx-icon.png"
import { toWalletClient } from "../../../util/toWalletClient"
import cash_icon from "../assets/BeamioStatic.svg"

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
const isAndroid = /Android/.test(navigator.userAgent)

if (typeof window !== "undefined") {
	try {
		sessionStorage.setItem("original_host", window.location.host)
	} catch {}
}

type EIP1193Provider = {
	isMetaMask?: boolean
	isCoinbaseWallet?: boolean
	request: (args: { method: string; params?: any[] | object }) => Promise<any>
	on?: (event: string, cb: (...args: any[]) => void) => void
	removeListener?: (event: string, cb: (...args: any[]) => void) => void
}

type WalletKind = "metamask" | "coinbase" | "okx"

function emitWalletEvent(type: string, detail?: any) {
	try {
		window.dispatchEvent(new CustomEvent(type, { detail }))
	} catch {}
}

function debugWalletDetection() {
	console.log("=== 钱包检测调试开始 ===")
	const { ethereum } = window as any

	console.log("window.ethereum:", {
		exists: !!ethereum,
		isMetaMask: ethereum?.isMetaMask,
		isOkxWallet: ethereum?.isOkxWallet,
		isOkExWallet: ethereum?.isOkExWallet,
		isCoinbaseWallet: ethereum?.isCoinbaseWallet,
		isTrust: ethereum?.isTrust,
	})

	if (ethereum?.providers && Array.isArray(ethereum.providers)) {
		console.log(`Found ${ethereum.providers.length} providers:`)
		ethereum.providers.forEach((p: any, idx: number) => {
			console.log(`  [${idx}]:`, {
				isMetaMask: p?.isMetaMask,
				isOkxWallet: p?.isOkxWallet,
				isOkExWallet: p?.isOkExWallet,
				isCoinbaseWallet: p?.isCoinbaseWallet,
				isTrust: p?.isTrust,
				rdnsName: p?.info?.rdns || "unknown",
			})
		})
	}

	const providers: any[] = []
	window.addEventListener("eip6963:announceProvider", (event: any) => {
		const { info, provider } = event.detail
		providers.push({ info, provider })
		console.log(`EIP-6963 provider announced: ${info.rdns}`)
	})

	window.dispatchEvent(new Event("eip6963:requestProvider"))

	const anyWin = window as any
	console.log("Independent injections:", {
		okxwallet: !!anyWin.okxwallet,
		okexwallet: !!anyWin.okexwallet,
		coinbaseWalletExtension: !!anyWin.coinbaseWalletExtension,
	})

	console.log("=== 调试结束 ===")
}

const eip6963ProvidersRef = { current: new Map<string, EIP1193Provider>() }

if (typeof window !== "undefined") {
	window.addEventListener("eip6963:announceProvider", (event: any) => {
		const { info, provider } = event.detail
		if (info?.rdns) {
			eip6963ProvidersRef.current.set(info.rdns, provider)
		}
	})
	window.dispatchEvent(new Event("eip6963:requestProvider"))
}

function getInjectedProvider(kind: WalletKind): EIP1193Provider | undefined {
	const { ethereum } = window as any

	const eip6963Map = eip6963ProvidersRef.current

	if (kind === "metamask") {
		const mmFromEIP = eip6963Map.get("io.metamask")
		if (mmFromEIP) return mmFromEIP
	}

	if (kind === "coinbase") {
		const cbFromEIP = eip6963Map.get("com.coinbase.wallet")
		if (cbFromEIP) return cbFromEIP
	}

	if (kind === "okx") {
		const okxFromEIP =
		eip6963Map.get("com.okex.wallet") || eip6963Map.get("com.okx.wallet")
		if (okxFromEIP) return okxFromEIP
	}

	if (ethereum?.providers && Array.isArray(ethereum.providers)) {
		const arr = ethereum.providers as any[]

		if (kind === "metamask") {
			const mm = arr.find((p) => {
				return (
				!!p?.isMetaMask &&
				!p?.isOkxWallet &&
				!p?.isOkExWallet &&
				!p?.isCoinbaseWallet
				)
			})
			if (mm) return mm as EIP1193Provider
		}

		if (kind === "coinbase") {
			const cb = arr.find(
				(p) => !!p?.isCoinbaseWallet && !p?.isOkxWallet && !p?.isOkExWallet
			)
			if (cb) return cb as EIP1193Provider
		}

		if (kind === "okx") {
			const ok = arr.find((p) => !!p?.isOkxWallet || !!p?.isOkExWallet)
			if (ok) return ok as EIP1193Provider
		}
	}

	if (ethereum) {
		if (kind === "okx") {
			if (ethereum.isOkxWallet || ethereum.isOkExWallet) {
				return ethereum as EIP1193Provider
			}
		}

		if (kind === "coinbase") {
			if (ethereum.isCoinbaseWallet && !ethereum.isOkxWallet && !ethereum.isOkExWallet) {
				return ethereum as EIP1193Provider
			}
		}

		if (kind === "metamask") {
			if (
				!!ethereum.isMetaMask &&
				!ethereum.isOkxWallet &&
				!ethereum.isOkExWallet &&
				!ethereum.isCoinbaseWallet
			) {
				// iOS Safari 中可能没有 isConnected，直接返回
				return ethereum as EIP1193Provider
			}
		}
	}

	const anyWin = window as any
	if (kind === "okx") {
		if (anyWin.okxwallet?.isOkxWallet) {
			return anyWin.okxwallet as EIP1193Provider
		}
		if (anyWin.okxwallet?.ethereum?.isOkxWallet) {
			return anyWin.okxwallet.ethereum as EIP1193Provider
		}
		if (anyWin.okexwallet?.isOkExWallet || anyWin.okexwallet?.isOkxWallet) {
			return anyWin.okexwallet as EIP1193Provider
		}
		if (anyWin.okexwallet?.ethereum?.isOkExWallet) {
			return anyWin.okexwallet.ethereum as EIP1193Provider
		}
	}

	if (
		kind === "coinbase" &&
		(window as any).coinbaseWalletExtension?.isCoinbaseWallet
	) {
		return (window as any).coinbaseWalletExtension as EIP1193Provider
	}

	if ((window as any).ethereum?.isTrust) return undefined

	return undefined
}

const BASE_CHAIN_ID = "0x2105"

type Props = {
	t: (cn: string, en: string, ja?: string) => string
	_open?: boolean
}

export default function ConnectWallet({ t, _open = false }: Props) {
	// 手机环境强制打开
	const shouldBeOpen =_open
	const [open, setOpen] = useState(shouldBeOpen)
	const [connecting, setConnecting] = useState<WalletKind | null>(null)
	const [address, setAddress] = useState<string | null>(null)
	const [chainId, setChainId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [currentKind, setCurrentKind] = useState<WalletKind | null>(null)
	const [mounted, setMounted] = useState(false)

	const providerRef = useRef<EIP1193Provider | null>(null)
	const onAccountsChangedRef = useRef<((accs: string[]) => void) | null>(null)
	const onChainChangedRef = useRef<((cid: string) => void) | null>(null)

	useEffect(() => {
		const onOpenModal = () => {
		setOpen(true)

		const st = (window as any).walletState
		if (st && st.account && st.chainId && st.provider) {
			providerRef.current = st.provider as EIP1193Provider
			setAddress(st.account)
			setChainId("0x" + st.chainId.toString(16))
			setCurrentKind(st.kind as WalletKind)
		}
		}

		;(window as any).openConnectWallet = () => {
			setOpen(true)
		}
		;(window as any).debugWalletDetection = debugWalletDetection

		window.addEventListener("wallet:openConnectModal", onOpenModal)

		const st = (window as any).walletState
		if (st && st.account && st.chainId && st.provider) {
			providerRef.current = st.provider as EIP1193Provider
			setAddress(st.account)
			setChainId("0x" + st.chainId.toString(16))
			setCurrentKind(st.kind as WalletKind)
		}

		setMounted(true)

		return () => {
			delete (window as any).debugWalletDetection
			if ((window as any).openConnectWallet) delete (window as any).openConnectWallet
			window.removeEventListener("wallet:openConnectModal", onOpenModal)
		}
	}, [])

	const metaMaskInjected = useMemo(
		() => Boolean(getInjectedProvider("metamask")),
		[open]
	)

	useEffect(() => {
		console.log("[ConnectWallet] _open prop changed:", { _open })
		// 手机环境忽略 _open，总是打开
		if (isMobile) {
			//		已经在metaMask
			if (metaMaskInjected) {
				setOpen(false)
				connect('metamask')
				return
			}

			if (coinbaseInjected) {
				setOpen(false)
				connect('coinbase')
				return
			}

			if (okxInjected) {
				setOpen(false)
				connect('okx')
				return
			}

			setOpen(true)
		} else {
			setOpen(_open)
		}
	}, [_open])



	const coinbaseInjected = useMemo(
		() => Boolean(getInjectedProvider("coinbase")),
		[open]
	)

	const okxInjected = useMemo(
		() => Boolean(getInjectedProvider("okx")),
		[open]
	)

	const metamaskConnected = !!address && currentKind === "metamask"
	const coinbaseConnected = !!address && currentKind === "coinbase"
	const okxConnected = !!address && currentKind === "okx"

	function detachListeners() {
		const provider = providerRef.current
		if (!provider) return
		if (onAccountsChangedRef.current) {
		provider.removeListener?.("accountsChanged", onAccountsChangedRef.current)
		}
		if (onChainChangedRef.current) {
		provider.removeListener?.("chainChanged", onChainChangedRef.current)
		}
		onAccountsChangedRef.current = null
		onChainChangedRef.current = null
	}

	const disconnect = React.useCallback((needEmit: boolean) => {
		detachListeners()
		providerRef.current = null
		setAddress(null)
		setChainId(null)
		setCurrentKind(null)
		setError(null)

		;(window as any).walletState = undefined
		if (needEmit) {
			emitWalletEvent("wallet:disconnected", {})
		}
	}, [])

	function getWalletTypeLabel(kind: WalletKind) {
		return kind === "metamask"
			? "MetaMask"
			: kind === "coinbase"
			? "Coinbase Wallet"
		: "OKX Wallet"
	}

	function setupProviderListeners(
		kind: WalletKind,
		provider: EIP1193Provider,
		account: string,
		chainHex: string
		) {
		// 先清掉旧监听
		detachListeners()

		const walletType = getWalletTypeLabel(kind)

		// ⭐ 当钱包内切换账号时
		const onAccountsChanged = async (accs: string[]) => {
			const next = accs?.[0]

			// 没有账号了，当作断开
			if (!next) {
				disconnect(true)
				return
			}

			try {
				const cidHex: string = await provider.request({ method: "eth_chainId" })
				const walletClient = toWalletClient(provider, next)

				;(window as any).walletState = {
					account: next,
					chainId: parseInt(cidHex, 16),
					kind,
					provider,
					walletClient,
				}

				setAddress(next)
				setChainId(cidHex)
				setCurrentKind(kind)

				// ⭐ 这里发出你要的事件：wallet:accountsChanged
				emitWalletEvent("wallet:accountsChanged", {
					account: next,
					chainId: parseInt(cidHex, 16),
					kind,
					walletType,
					provider,
					walletClient,
				})
			} catch (err) {
				console.error("[ConnectWallet] handle accountsChanged error", err)
			}
		}

		provider.on?.("accountsChanged", onAccountsChanged)
		onAccountsChangedRef.current = onAccountsChanged

		// （可选）顺便把 chainChanged 也规范一下
		const onChainChanged = (cidHex: string) => {
			try {
			setChainId(cidHex)
			const st = (window as any).walletState
			if (st) {
				st.chainId = parseInt(cidHex, 16)
			}

			emitWalletEvent("wallet:chainChanged", {
				chainId: parseInt(cidHex, 16),
				kind,
				walletType,
			})
			} catch (err) {
			console.error("[ConnectWallet] handle chainChanged error", err)
			}
		}

		provider.on?.("chainChanged", onChainChanged)
		onChainChangedRef.current = onChainChanged
	}


	const getDappUrl = () => {
		return `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`
	}

	// MetaMask：官方 dapp deeplink
	const getMetaMaskDeeplink = () => {
		const dappUrl = getDappUrl()
		return `https://metamask.app.link/dapp/${encodeURIComponent(dappUrl)}`
	}

	// Coinbase Wallet：官方 universal link
	// https://go.cb-w.com/dapp?cb_url=<encoded-dapp-url> :contentReference[oaicite:0]{index=0}
	const getCoinbaseDeeplink = () => {
		const dappUrl = getDappUrl()
		return `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(dappUrl)}`
	}

	// OKX Web3 Wallet：官方 universal link 写法
	// 深度链接示例：okx://wallet/dapp/url?dappUrl=<encoded-dapp-url>
	// 然后包一层 https://web3.okx.com/download?deeplink=<encoded-deeplink> :contentReference[oaicite:1]{index=1}
	const getOkxDeeplink = () => {
		const dappUrl = getDappUrl()
		const encodedDappUrl = encodeURIComponent(dappUrl)
		const deeplink = `okx://wallet/dapp/url?dappUrl=${encodedDappUrl}`
		return `https://web3.okx.com/download?deeplink=${encodeURIComponent(deeplink)}`
	}

	async function connect(kind: WalletKind) {
		setError(null)
		if (address && currentKind && currentKind !== kind) {
			disconnect(false)
		}

		setConnecting(kind)

		try {
			// ⭐⭐ 1. 手机环境统一走 deeplink，一键打开 / 安装
			if (isMobile && (!metaMaskInjected && !okxInjected && !coinbaseInjected) ) {
				if (kind === "metamask") {
					window.location.href = getMetaMaskDeeplink()
					return
				}
				if (kind === "coinbase") {
					window.location.href = getCoinbaseDeeplink()
					return
				}
				if (kind === "okx") {
					window.location.href = getOkxDeeplink()
					return
				}
				// 其他钱包（如果以后扩展）再加分支
			}

			// ⭐⭐ 2. 非手机（桌面）环境：尝试注入式 provider
			const provider = getInjectedProvider(kind)

			if (!provider) {
			// 桌面没装扩展的兜底：跳下载页 / 官方站
			if (kind === "metamask") {
				window.open("https://metamask.io/download/", "_blank")
			} else if (kind === "coinbase") {
				window.open("https://www.coinbase.com/wallet", "_blank")
			} else if (kind === "okx") {
				window.open(
				"https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
				"_blank"
				)
			}
			return
			}

			// ===== 下面是你原来的连接逻辑，不变 =====
			providerRef.current = provider

			const accounts: string[] = await provider.request({
					method: "eth_requestAccounts",
			})
			const cidHex: string = await provider.request({ method: "eth_chainId" })
			const isBase = cidHex === BASE_CHAIN_ID

			setAddress(accounts?.[0] ?? null)
			setChainId(cidHex ?? null)
			setCurrentKind(kind)

			if (!isBase) {
				try {
					await provider.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: BASE_CHAIN_ID }],
					})
					const cid2: string = await provider.request({ method: "eth_chainId" })
					const accs2: string[] = await provider.request({
						method: "eth_accounts",
					})
					const account2 = accs2?.[0] ?? accounts?.[0] ?? ""
					if (cid2 === BASE_CHAIN_ID && account2) {
						const walletClient = toWalletClient(provider, account2)
						;(window as any).walletState = {
							account: account2,
							chainId: parseInt(cid2, 16),
							kind,
							provider,
							walletClient,
						}
						setAddress(account2)
						setChainId(cid2)
						setCurrentKind(kind)
						setOpen(false)

						const walletType = getWalletTypeLabel(kind)

						emitWalletEvent("wallet:connected", {
							account: account2,
							chainId: parseInt(cid2, 16),
							kind,
							walletType,
							provider,
							walletClient,
						})

						// ⭐ 新增：连接成功后挂上 accountsChanged / chainChanged 监听
						setupProviderListeners(kind, provider, account2, cid2)
					} else {
						setError(
							"Tried switching to Base; no account returned. Please authorize in wallet and retry."
						)
					}
				} catch (err: any) {
					if (err?.code === 4001) {
					setError("Network switch was canceled.")
					} else {
					setError(err?.message || String(err))
					}
				}
			} else {
				const account0 = accounts?.[0] ?? ""
				const walletClient = toWalletClient(provider, account0)
				;(window as any).walletState = {
					account: account0,
					chainId: parseInt(cidHex, 16),
					kind,
					provider,
					walletClient,
				}
				setAddress(account0)
				setChainId(cidHex)
				setCurrentKind(kind)
				setOpen(false)

				const walletType = getWalletTypeLabel(kind)

				emitWalletEvent("wallet:connected", {
					account: account0,
					chainId: parseInt(cidHex, 16),
					kind,
					walletType,
					provider,
					walletClient,
				})

				// ⭐ 新增
				setupProviderListeners(kind, provider, account0, cidHex)
			}
		} catch (e: any) {
			setError(e?.message ?? String(e))
		} finally {
			setConnecting(null)
		}
	}

	return (

		<div className="relative w-full flex-1 flex flex-col">


			{open ? (
			<div className="w-full mt-4 rounded-2xl border border-black/20 bg-[#f8f8f8] text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
				<div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
				<div className="flex items-center gap-3">
					<img src={cash_icon} alt="CC Wallet" className="w-5 h-5" />
					<h3 className="text-base font-semibold">
					{t("请选择钱包", "Select Wallet", "ウォレットを選択")}
					</h3>
				</div>

				{/* <button
					onClick={() => {
					setOpen(false)
					emitWalletEvent("wallet:closed", {})
					}}
					className="text-xs px-2 py-1 rounded-lg border border-black/20 hover:bg-[#f0f0f0] transition"
				>
					Close
				</button> */}
				</div>

				<div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
					{
						(isMobile || metaMaskInjected) && (
							<button
								disabled={connecting !== null && !metamaskConnected}
								onClick={() => {
									if (metamaskConnected) {
										disconnect(true)
									} else {
										connect("metamask")
									}
								}}
								className="w-full flex items-center justify-between rounded-xl border border-black/20 bg-[#f8f8f8] px-4 py-3 hover:bg-[#f0f0f0] transition disabled:opacity-50"
							>
								<div className="flex items-center gap-3">
									<img
										src={metamask_icon}
										alt="MetaMask"
										className="w-7 h-7 rounded-sm"
									/>
									<div className="text-left">
										<div className="text-sm font-medium">MetaMask</div>
										<div className="text-xs text-black/60">
										{metamaskConnected
											? t("已连接此钱包", "Connected to this wallet", "このウォレットに接続中")
											: metaMaskInjected
											? t(
												"已检测到钱包环境",
												"Wallet environment detected",
												"ウォレット環境を検出しました"
											)
											:t(
												"点击在 MetaMask 内打开",
												"tap to open in MetaMask",
												"MetaMaskで開くにはタップしてください"
											)}
										</div>
									</div>
								</div>
								<div className="text-xs">
								{metamaskConnected
									? t("断开连接", "Disconnect", "切断")
									: connecting === "metamask"
									? t("连接中…", "Connecting…", "接続中…")
									: t("连接", "Connect", "接続")}
								</div>
							</button>
						)
					}

					{
						(isMobile || coinbaseInjected) && (
							<button
								disabled={connecting !== null && !coinbaseConnected}
								onClick={() => {
								if (coinbaseConnected) {
									disconnect(true)
								} else {
									connect("coinbase")
								}
								}}
								className="w-full flex items-center justify-between rounded-xl border border-black/20 bg-[#f8f8f8] px-4 py-3 hover:bg-[#f0f0f0] transition disabled:opacity-50"
							>
								<div className="flex items-center gap-3">
								<img
									src={coinbase_icon}
									alt="Coinbase Wallet"
									className="w-7 h-7 rounded-sm"
								/>
								<div className="text-left">
									<div className="text-sm font-medium">Coinbase</div>
									<div className="text-xs text-black/60">
									{coinbaseConnected
										? t("已连接此钱包", "Connected to this wallet", "このウォレットに接続中")
										: coinbaseInjected
										? t(
											"已检测到浏览器扩展",
											"Browser extension detected",
											"ブラウザ拡張機能が検出されました"
										)
										: t(
											"未检测到，点击将跳转安装",
											"Not detected, click to install",
											"検出されません。クリックしてインストールしてください"
										)}
									</div>
								</div>
								</div>
								<div className="text-xs">
								{coinbaseConnected
									? t("断开连接", "Disconnect", "切断")
									: connecting === "coinbase"
									? t("连接中…", "Connecting…", "接続中…")
									: t("连接", "Connect", "接続")}
								</div>
							</button>
						)
					}

					{
						(isMobile || okxInjected) && (
							<button
								disabled={connecting !== null && !okxConnected}
								onClick={() => {
								if (okxConnected) {
									disconnect(true)
								} else {
									connect("okx")
								}
								}}
								className="w-full flex items-center justify-between rounded-xl border border-black/20 bg-[#f8f8f8] px-4 py-3 hover:bg-[#f0f0f0] transition disabled:opacity-50"
							>
								<div className="flex items-center gap-3">
								<img
									src={okx_icon}
									alt="OKX Wallet"
									className="w-7 h-7 rounded-sm"
								/>
								<div className="text-left">
									<div className="text-sm font-medium">OKX</div>
									<div className="text-xs text-black/60">
									{okxConnected
										? t("已连接此钱包", "Connected to this wallet", "このウォレットに接続中")
										: okxInjected
										? t(
											"已检测到浏览器扩張",
											"Browser extension detected",
											"ブラウザー拡張機能を検出しました"
										)
										: t(
											"未检测到，点击将跳转安装",
											"Not detected, click to install",
											"検出されません。クリックしてインストールしてください"
										)}
									</div>
								</div>
								</div>
								<div className="text-xs">
								{okxConnected
									? t("断开连接", "Disconnect", "切断")
									: connecting === "okx"
									? t("连接中…", "Connecting…", "接続中…")
									: t("连接", "Connect", "接続")}
								</div>
							</button>
						)
					}

					<p className="text-[10px] text-slate-500 mt-1">
						We&apos;ll open your wallet app and pre-fill the transaction on Base so you can confirm there. Gas is sponsored by Beamio, so you won&apos;t pay network fees.
					</p>


				{chainId && chainId !== BASE_CHAIN_ID && (
					<div className="mt-2 rounded-xl border border-black/20 bg-[#f9f9f9] text-black px-4 py-3 text-xs leading-relaxed">
					<div className="font-medium">[ NETWORK NOTICE ]</div>
					<div className="mt-1">
						当前网络{" "}
						<span className="font-mono">
						{parseInt(chainId, 16)}
						</span>
						，需要切换到
						<span className="font-mono ml-1">Base (8453)</span>。
					</div>
					</div>
				)}

				{error && (
					<div className="mt-2 rounded-xl border border-black/30 bg-[#fff] text-black px-4 py-3 text-xs break-words">
					Error: {error}
					</div>
				)}
				</div>
			</div>
			) : (
			<div style={{ color: "#999", fontSize: "14px", padding: "20px", textAlign: "center" }}>
				Modal is closed. open = {String(open)}, _open = {String(_open)}
			</div>
			)}
		</div>
		
	)
}