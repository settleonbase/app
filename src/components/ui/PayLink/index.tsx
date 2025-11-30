import { useState, useRef, useEffect } from "react"
import { makeT, type TranslateFn, type Lang } from "../../../util/i18n"

import { getAddress } from "ethers"

import ShowPaymentUrl from "./showPaymentLink"
import cashcodeIcon from '../assets/cashcode_icon.svg'
import AmountInput from './AmountInput'
import { pickApprovedProvider, getCCWallet, x402PaymentLink, getBalance} from '../../../util/utils'
import { Copy } from "lucide-react";  // ✅ Lucide 图标库
import NoteInput from './NoteInput'
import ConnectWallet from './ConnectWallet'
import metamaskIcon from '../assets/metamask-icon.svg'
import coinbase from '../assets/base-logo.png'
import okxIcon from '../assets/okx-icon.png'
import base_ex from '../assets/base-ex.svg'

import CCWallet_Sign from './CCWallet_Show402_Sign'
import {AppButton} from './AppButton'
import {ethers} from 'ethers'


type TabKey = "check" | "link"

type ResultShape = {
	code?: string
	url?: string
} | null

const baseProvider = new ethers.JsonRpcProvider('https://1rpc.io/base')

type Props = {
	lang: Lang
	setDemoOpen: React.Dispatch<React.SetStateAction<boolean>>
	wallet?: string
	id?: string
	amt?: string
	note?: string,
	recipient: string
	code: string
}

const fmtAddr = (a = '') => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—'

export default function CashcodeAPP ({ lang, setDemoOpen, wallet='', amt, note, recipient, code }: Props) {

	const providerRef = useRef<any>(null)
	const t: TranslateFn = makeT(lang)
	
	const [tab, setTab] = useState<TabKey>("check")
	const [amount, setAmount] = useState<string|undefined>(amt)
	

	const [nodeInput, setNodeInput ] = useState<string>('')
	const [accountUSDC_Balance, setAccountUSDC_Balance] = useState(0)
	const [result, setResult] = useState<ResultShape>(null)
	const [walletAccount, setWalletAccount] =  useState<string>(wallet)
	const [isEOAAccount, setIsEOAAccount] = useState(true)

	const [walletKind, setWalletKind] = useState<string>('') // 新增状态以保存钱包类型

	const walletClientRef = useRef<any | null>(null)
	const [showConnectWallet, setShowConnectWallet] = useState(true)
	const [process, setProcess] = useState(false)

	const [showThirdPartyWallet, setShowThirdPartyWallet] = useState(true)

	const [successPayLink, setSuccessPayLink] = useState<string>('')

	const [signx402Show, setSignx402Show] = useState(false)
	const [error, setError] = useState<string>("")
	const [signx402ShowUrl, setSignx402ShowUrl] = useState<string>('')
	const [tipAmount, setTipAmount] = useState("0.00"); // Request 模式的 tip
	const [tipError, setTipError] = useState(false)
	const [showReject, setShowReject] = useState(true)

	

	const onWConnect = (client: any) => {
		walletClientRef.current = client // ✅ 不触发 re-render
	}

	const fetchUsdcBalance = async () => {
		if (!walletAccount) return
		const _ba = await getBalance(walletAccount)

		if (!_ba) return
		const ba = _ba
		// const eth = Number(ba.oracle.eth)
		// const ethUsd = eth * Number(ba.oracle.eth)
		if (_ba.eoa !== '0x') {
			setIsEOAAccount(false)
		}

		const usdc = Number(ba.usdc)
		setAccountUSDC_Balance(usdc)
	}

	useEffect(() => {
		fetchUsdcBalance()
	}, [walletAccount, tipAmount, process])


	useEffect(() => {
		setResult(null)
	}, [tab])

	useEffect(() => {
		pickApprovedProvider()
		fetchUsdcBalance()
	}, [])

	const totalAmount = Number(tipAmount) + Number(amount)
	useEffect(() => {
		if (!walletAccount) {
			return setError('')
		}
		if ( totalAmount > accountUSDC_Balance) {
			return setError('Insufficient balance')
		}
		return setError('')
	}, [tipAmount, accountUSDC_Balance])


    const rnd = (n: number): string => Math.random().toString(36).slice(2, 2 + n).toUpperCase()


	const SelectWallet = () => {
		useEffect(() => {
			const eth = (window as any).ethereum;
			if (!eth) return;

			const onWConnected = async (e: any) => {
				const raw = e?.detail?.account || ""
				providerRef.current = e?.detail?.provider || null  // ← 保存 provider

				setWalletKind(e?.detail?.walletType || "")
				setWalletAccount(getAddress(raw))
				
				setShowThirdPartyWallet(false)
				const wKind = e?.detail?.walletClient
				onWConnect(wKind)
				setError('')
				setShowConnectWallet(false)
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
			};

			const onWAcc = (e: any) => {
				const raw = e?.detail?.account || ""  
				setWalletAccount(getAddress(raw))
				setError('')
				setShowThirdPartyWallet(false)
				providerRef.current = e?.detail?.provider || null  // ← 保存 provider
				
			}

			const onWDisc = () => {
				setShowThirdPartyWallet(false)
				onWConnect(null)
				setWalletKind('')
				setError('')
				setShowReject(true)
				setWalletAccount('')
			}

			const onClosed = () => {
				setError('')
				setShowThirdPartyWallet(false)
			}

			
			window.addEventListener("wallet:connected", onWConnected as any)
			window.addEventListener("wallet:accountsChanged", onWAcc as any)
			window.addEventListener("wallet:disconnected", onWDisc as any);
			window.addEventListener("wallet:closed", onClosed as any);

			//		show wallet 
			(window as any).openConnectWallet?.()
			window.dispatchEvent(new CustomEvent("wallet:openConnectModal"))

			return () => {

				window.removeEventListener("wallet:connected", onWConnected as any);
				window.removeEventListener("wallet:accountsChanged", onWAcc as any);
				window.removeEventListener("wallet:disconnected", onWDisc as any);
				window.removeEventListener("wallet:closed", onClosed as any);
			};


		}, [])

		return (
			<>
				{ showConnectWallet && <ConnectWallet t={t} _open={showConnectWallet} />}
			</>
			
		)
	}

	const Header = () => {
		
		return (
			<>
			{/* 顶部标签栏 */}
				<div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
					{/* 左侧：标签按钮区或空占位 */}
					<div className="flex items-center gap-3 text-sm">
						
						{	
							<>
								{/* 中间：标题（中、英、日） */}
								<div className="absolute left-1/2 -translate-x-1/2 text-center">
									<div className="text-sm font-medium leading-tight">
									{t("支付请求", "Payment Request", "支払いリクエスト")}
									</div>
								</div>

							</>
						}
					</div>

					{/* 右侧：关闭按钮 */}
					<button
						onClick={() => setDemoOpen(false)}
						className="text-sm hover:underline text-black/70"
					>
						{t("关闭", "Close", "閉じる")}
					</button>
				</div>
				{/* 全局钱包 */}
				{
					walletAccount && (
						<div className="flex items-center justify-between px-5 py-4">
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={() => {
										
										navigator.clipboard.writeText(walletAccount || '')
										
									}}
									className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 transition"
								>
									{
										
									}
									<img src={ 
										/metamask/i.test(walletKind) ? metamaskIcon : /coinbase/i.test(walletKind) ? coinbase : /okx/i.test(walletKind) ? okxIcon :
										cashcodeIcon
									} alt="Wallet" className="w-4 h-4" />
									<span className="text-sm font-medium text-black/80">{fmtAddr(walletAccount)}</span>
									<Copy size={18} className="text-black/60" />
								</button>
								
								<button
									type="button"
									onClick={() => {
										
											setShowConnectWallet(true)
										
										
									}}
									className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-black/5 hover:bg-black/10 transition"
									title="Key"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-5 h-5 text-blue-600 flex-shrink-0"
									>
										<path d="M17 14h2a2 2 0 0 0 0-4h-2" />
										<path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
									</svg>
								</button>
							</div>
							{/* 右侧：USDC + 余额（上下居中） */}
							{typeof accountUSDC_Balance !== 'undefined' && (
								<div className="flex items-center gap-2 pr-2">
									<span className="text-sm font-medium text-black/50 leading-none mt-[5px]">
										USDC $
									</span>

									<div className="text-4xl font-extrabold tracking-tight leading-none">
										{accountUSDC_Balance.toFixed(2)}
									</div>
								</div>
							)}
						</div>

					)
						
				}
				
			</>
		)
	}

	const GenerateForm = () => {
		return (
			<div>
				<Header />
				<PayForm /> 
			</div>
		)
	}

	const ShowNode = (nodeInfo?: string) => {
		const [showNodeInfo] = useState(nodeInfo)
		return (
			<div className="mb-3">
				<label className="block text-[11px] text-slate-500 mb-1">Notes</label>
				<div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-800 text-center">
					{showNodeInfo}
				</div>
			</div>
		)
	}

	const ShowAmount = () => {
		const [showAmt] = useState(amt)
		return (

				<div className="mb-3">
					<div className="flex items-center justify-between mb-1">
						<label className="block text-[11px] text-slate-500">Amount</label>
						<span className="text-[11px] text-slate-400">USDC on Base</span>
					</div>
					<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
						<span className="text-[12px] text-slate-500">You will pay</span>
						<span className="text-lg font-semibold text-slate-900 tracking-tight">{showAmt}</span>
					</div>
				</div>
		)
	}

	const x402Sign = (data: any) => {
		setSignx402Show(false)

		//		sign stage! 
		if (typeof data === 'boolean') {
			if (!data) {
				setProcess(false)
				return setError(t("取消签字", "Cancel Signature", "署名をキャンセル"))
			}

			return
		}
		//		finished stage! 
		//		error!
		if (data == null) {
			return setError(t("发生错误，请稍后再试", "An error occurred, please try again later", "エラーが発生しました。しばらくしてからもう一度お試しください"))
		}
		//success!
		

		console.log(data)
		setSuccessPayLink (data?.USDC_tx)
		
	} 

	const TipInput = () => {
			return (
				<div className="mb-5">
					<div className="flex items-center justify-between mb-1">
						<label className="block text-[11px] text-slate-500">Tip (optional)</label>
						<span className="text-[10px] text-slate-400">Added on top of the amount</span>
					</div>

					<div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 flex items-center mb-2">
						<span className="text-[11px] text-slate-400 mr-2">USDC</span>
						<input
							value={tipAmount}
							placeholder="0.00"
							className={
								"flex-1 bg-transparent text-[12px] text-right placeholder:text-slate-300 focus:outline-none " +
								(tipError
								? "border border-red-300 bg-red-50/40 text-red-700 rounded-xl"
								: "border border-transparent")
							}
							onChange={(e) => {
								const v = e.target.value
								setTipAmount(v)

								// 是否为有效数字（忽略空字符串）
								const n = Number(v)
								setTipError(v.trim() !== "" && isNaN(n))
							}}
							/>
					</div>
							
					{/* Quick tip percentages */}
					<div className="flex items-center gap-2 text-[11px]">
						{[0, 15, 18, 20].map((p) => (
							<button
							key={p}
							type="button"
							className="
								flex-1 px-2.5 py-1 
								rounded-full border 
								border-slate-300 dark:border-slate-600 
								text-slate-700 dark:text-slate-200 
								bg-slate-900/5 dark:bg-black/40 
								hover:border-slate-500 dark:hover:border-slate-300 
								transition text-center
							"
							onClick={() => {
								const _amt = Number(amt)
								const base = isNaN(_amt) ? 0 : _amt
								const t = base > 0 ? base * (p / 100) : 0
								setTipAmount(t.toFixed(2))
							}}
							>
							{p}%
							</button>
						))}
					</div>
					<p className="text-[10px] text-slate-500">
						Choose a quick tip or leave it empty. Tips go directly to the merchant.
					</p>
				</div>
			)
	}

	const payLinkClick = async (reject: boolean) => {
		if ( !reject && (!walletAccount|| !amt ) || error) {
			return
		}



		const total = Number(tipAmount) + Number(amount)
		if ( !reject && total > accountUSDC_Balance) {
			
			return setError('Insufficient balance')
		}

		setProcess(true)
		if (!reject) {
			setShowReject(false)
		}

		/**
		 * 			test uint
		 */

		// setTimeout(() => {
		// 	setProcess(false)
		// 	setError(t("发生错误，请稍后再试", "An error occurred, please try again later", "エラーが発生しました。しばらくしてからもう一度お試しください"))
		// }, 2000)

		// if (!walletKind) {
		// 	return payWuthCC()
		//
		
		
		const result = await x402PaymentLink(reject ? '0' : total.toString(), walletAccount, walletClientRef.current, code)
		setProcess(false)

		if (result === undefined && reject) {
			return setSuccessPayLink('success')
		}
		if (!result) {
			return setError(t("发生错误，请稍后再试", "An error occurred, please try again later", "エラーが発生しました。しばらくしてからもう一度お試しください"))
		}

		setSuccessPayLink(result)
		
		
	}

	const Paymentbreakdown = () => {
		return (
			<div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex justify-between">
              <span>Request amount</span>
              <span className="text-slate-900 font-medium"> {amount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Tip</span>
              <span className="text-slate-900 font-medium">{tipAmount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Gas fee</span>
              <span className="text-emerald-600 font-medium">Sponsored by Beamio</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
              <span>Total from your wallet</span>
              <span className="text-slate-900 font-semibold">{totalAmount.toFixed(2)} USDC</span>
            </div>
          </div>
		)
	}

	const PayForm = () => {
		
		return (
			<>

				{/* 主体改为上下结构 */}
				{
					signx402Show ?
					<CCWallet_Sign url={signx402ShowUrl} final={x402Sign} t={t}  /> 
					:
					<div className="p-5 space-y-5">
						{
							successPayLink ?  <>
								<main className="px-5 pt-2 pb-5 flex flex-col gap-4 items-stretch">
								<div className="flex flex-col items-center gap-2">
									<div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
									<span className="text-xl text-emerald-600">✓</span>
									</div>
									<p className="text-sm font-semibold text-slate-900">Payment successful</p>
								</div>

								<div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-[11px] flex flex-col gap-1">
									<div className="flex items-center justify-between">
									<span className="text-slate-500">Status</span>
									<span className="font-semibold text-emerald-600">Successful</span>
									</div>
									<div className="flex items-center justify-between">
									<span className="text-slate-500">Success at</span>
									<span className="font-medium text-slate-900">
										{new Date(new Date()).toLocaleString(undefined, {
											year: "numeric",
											month: "2-digit",
											day: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
										})}
									</span>
									</div>
									<div className="flex items-center justify-between">
									<span className="text-slate-500">They will receive</span>
									<span className="font-medium text-slate-900">{amount} USDC</span>
									</div>
									<div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-200">
									<span className="text-slate-500">View transaction</span>
									<button 
										className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
									>
										<span>Open in explorer</span>
										<span>
											<a
											href={`https://basescan.org/tx/${successPayLink}`}
											target="_blank"
											rel="noreferrer"
											className="ml-2 inline-flex items-center justify-center rounded-md border border-blue-500 px-1.5 py-0.5 hover:bg-blue-600 hover:text-white transition"
											aria-label={t("查看交易", "View on BaseScan", "BaseScanで表示")}
											title={t("查看交易", "View on BaseScan", "BaseScanで表示")}
											>
											<img src={base_ex} alt="" className="w-4 h-4" />
											<span className="sr-only">
												{t("查看交易", "View on BaseScan", "BaseScanで表示")}
											</span>
											</a>
										</span>
									</button>
									</div>
								</div>

								<p className="text-[10px] text-slate-400 text-center">
									You can now close this window. The payment will also appear in your wallet activity.
								</p>
								</main>

								{/* Footer */}
								<footer className="px-5 pt-1 pb-4 bg-white border-t border-slate-100 flex flex-col gap-2">
								<button 
									className="w-full rounded-full bg-slate-900 text-white text-sm font-semibold py-2.5 hover:bg-slate-800"
									onClick={() => {
										setDemoOpen(false)
									}}
								>
									Done
								</button>
								</footer>
{/* 								
								<div className="text-xs text-black/60 text-right mt-2">
									<h2 className="text-sm font-semibold text-black/80 mb-1">
										{successPayLink && /^0x[0-9a-fA-F]{64}$/.test(successPayLink) ? t("支付成功：", "Successful:", "支払い成功：") : t("拒绝成功", "Reject Successful", "拒否成功")}
									</h2>
									<span className="inline-flex items-center">
										{t("兑换时间", "Success at", "引き換え日時")}：
										{new Date(new Date()).toLocaleString(undefined, {
											year: "numeric",
											month: "2-digit",
											day: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
										})}

										{successPayLink && /^0x[0-9a-fA-F]{64}$/.test(successPayLink) && (
											<a
											href={`https://basescan.org/tx/${successPayLink}`}
											target="_blank"
											rel="noreferrer"
											className="ml-2 inline-flex items-center justify-center rounded-md border border-blue-500 px-1.5 py-0.5 hover:bg-blue-600 hover:text-white transition"
											aria-label={t("查看交易", "View on BaseScan", "BaseScanで表示")}
											title={t("查看交易", "View on BaseScan", "BaseScanで表示")}
											>
											<img src={base_ex} alt="" className="w-4 h-4" />
											<span className="sr-only">
												{t("查看交易", "View on BaseScan", "BaseScanで表示")}
											</span>
											</a>
										)}
									</span>
								</div> */}
						
							</>
							: <>

								{ShowNode(note)}
								<ShowAmount />
								<TipInput />
								
								{error ? (
									<div className="mt-2 text-[13px] text-red-600" aria-live="polite">
										{error}
									</div>
								) : null}

								<Paymentbreakdown />
								{
									walletAccount && 
									<AppButton
										disabled={!!error|| !isEOAAccount}
										fullWidth
										loading={process}
										onClick={() => {

											if (!!error||!isEOAAccount) {
												return
											}

											if (!walletAccount) {
												return SelectWallet()
											}
											payLinkClick(false)

										}}
									>
										{isEOAAccount ? t("继续", "Continue in your wallet", "続行"): t('暂不支持 Smart Account（EIP-1271）账户','Smart Accounts (EIP-1271) are not supported yet','Smart Account（EIP-1271）アカウントには、まだ対応していません')}
									</AppButton>
								}
								{
									!walletAccount && 
									<AppButton
										disabled={!!error}
										fullWidth
										loading={process}
										onClick={() => {
											const url = new URL(window.location.href)
											const newUrl = `${url.origin}/app${url.search}`
											window.open(newUrl, "_blank") 
										}}
									>
										Pay {totalAmount.toFixed(2)} USDC with Beamio
									</AppButton>
								}

								
								
								{/* <button
									onClick={() => {
										payLinkClick()
									}}
									disabled={process}
									className={`
										mt-4 w-full border border-black px-3 py-2 text-sm rounded-xl transition
										${process
											? "bg-gray-200 text-gray-500 cursor-not-allowed"
											: "hover:bg-black hover:text-white"}
									`}
								>
									{process
										? t("正在交易中…", "Processing…", "処理中…")
										: t("继续", "Continue", "続行")}
								</button> */}
								{
									!walletAccount && 
										<div className="flex items-center my-2">
											<div className="flex-1 h-px bg-slate-200" />
											<span className="mx-2 text-[10px] text-slate-400 uppercase tracking-[0.12em]">or</span>
											<div className="flex-1 h-px bg-slate-200" />
										</div>
								}
								    

								<SelectWallet />

								{
									(!process ||process && showReject ) && 
											<AppButton
												variant='secondary'
												fullWidth
												loading={process}
												onClick={() => {
													payLinkClick(true)
												}}
										>
											{t("拒绝请求", "Reject request", "リクエストを拒否")}
										</AppButton>
								}
								
							</>
						}
					</div>
				}
			</>
		)
	}

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
			{/* 外框整体圆角 */}
			<div
				className="
				w-full max-w-md 
				max-h-[80vh]          /* 整个弹窗高度不超过屏幕 80% */
				bg-white text-black 
				border border-black 
				shadow-2xl 
				rounded-3xl 
				overflow-hidden 
				flex flex-col         /* 让内部可以用 flex-1 + overflow 滚动 */
				"
			>
				{/* 可滚动内容区 */}
				<div className="flex-1 min-h-0 overflow-y-auto">
					<GenerateForm />
				</div>
				
			</div>
		</div>

	)
}
 
