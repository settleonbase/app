import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
// import ConnectWallet from './ConnectWallet'

type Props = {
	
	usdcBalance?: number
	t: (cn: string, en: string, ja?: string) => string


	// walletClient: any

	// address: string
	// lang: Lang
	// setResult: (val: any) => void
	// result: any
	// setFinishedPay: (val: string) => void
}


export type CheckHandle = {
	/** 方便外部把焦点放到金额输入框 */
	focusAmount: () => void
}


const Transfer = ({ usdcBalance = 0, t} :
	Props) =>  {

	const [amount, setAmount] = useState('')
	const [error, setError] = useState(false)
	const [, setWalletKind] = useState<string>('')
	const [,setAccountInput] = useState('')
	const [, setWalletClient] = useState<any>(null)

	// const amountNum = Number(amount || 0)
	// const fee = amountNum > 0 ? Math.max(amountNum * 0.005, 0.1) : 0
	// const netAmount = amountNum > 0 ? Math.max(amountNum - fee, 0) : 0

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		setAmount(val)

		const num = Number(val)
		if (!isNaN(num) && num > usdcBalance) {
			setError(true)
		} else {
			setError(false)
		}
	}

	const handleConnected = (addr: string, wtype: string, walletClient: any) => {
		setAccountInput(addr)
		if (/okx/i.test(wtype)) {
			wtype = 'okx'
		} else if (/coinbase/i.test(wtype)) {
			wtype = 'coinbase'
		} else if (/metamask/i.test(wtype)) {
			wtype = 'metamask'
		}
		setWalletKind(wtype)
		setWalletClient(walletClient)
	}

		const handleDisconnected = () => {
		setAccountInput('')
		setWalletKind('')
	}

	const handleMax = () => {
			setAmount(usdcBalance.toString())
			setError(false)
	}

	function SelectWallet() {
		const [showConnectWallet, setShowConnectWallet] = useState(true)
		useEffect(() => {
			const eth = (window as any).ethereum
			if (!eth) return

			const onWConnected = (e: any) => {
				const raw = e?.detail?.account || ""
				const walletType = e?.detail?.walletType || ""
				const walletClient = e?.detail?.walletClient
				try {
					handleConnected(ethers.getAddress(raw), walletType, walletClient)
				} catch {
					handleDisconnected()
				}
			}

			const onWAcc = (e: any) => {
				const raw = e?.detail?.account || ""
				const walletType = e?.detail?.walletType || ""
				const walletClient = e?.detail?.walletClient
				try {
					handleConnected(ethers.getAddress(raw), walletType, walletClient)
				} catch {
					handleDisconnected()
				}
			}

			const onWDisc = () => handleDisconnected()

				window.addEventListener("wallet:connected", onWConnected as any)
				window.addEventListener("wallet:accountsChanged", onWAcc as any)
				window.addEventListener("wallet:disconnected", onWDisc as any)
				return () => {
					window.removeEventListener("wallet:connected", onWConnected as any)
					window.removeEventListener("wallet:accountsChanged", onWAcc as any)
					window.removeEventListener("wallet:disconnected", onWDisc as any)
				}
		}, [handleConnected, handleDisconnected])


		return (
			<>
				{showConnectWallet && (
					<div className="flex justify-end">
						<div
							role="button"
							onClick={() => {
								(window as any).openConnectWallet?.()
								window.dispatchEvent(new CustomEvent("wallet:openConnectModal"))
								setShowConnectWallet(false)
							}}
							className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 transition"
						>
							{t("通过其他钱包", "Via Other Wallet", "他のウォレット経由")}
						</div>
					</div>
				)}
				
			</>
		)
}


// 点击逻辑


	return (
		<div className="mt-6">
			
			{/* ===== 去除 Chrome/Safari/Edge 数字上下箭头 ===== */}
			<style>
				{`
				input[type=number]::-webkit-inner-spin-button,
				input[type=number]::-webkit-outer-spin-button {
					-webkit-appearance: none;
					margin: 0;
				}
				input[type=number] {
					-moz-appearance: textfield;
				}
				`}
			</style>
			
			
			{/* ===== 金额输入区 ===== */}
			<div className="flex items-center w-full min-w-0 relative">
				{/* 左侧 $ */}
				<span className="absolute left-3 text-[40px] font-semibold text-[#2563eb] select-none">$</span>

				{/* 输入框 + Max按钮容器 */}
				<div className="flex items-center w-full pl-10 pr-3">
					<input
					type="number"
					inputMode="decimal"
					placeholder="0"
					value={amount}
					onChange={handleChange}
					className={`
						flex-1 min-w-0 text-[40px] font-semibold text-right
						bg-transparent outline-none border-none focus:ring-0
						appearance-none [appearance:textfield] [-moz-appearance:textfield]
						transition-colors
						${error ? 'text-red-500 placeholder:text-red-300' : 'text-[#2563eb] placeholder:text-[#2563eb]/40'}
					`}
					style={{
						WebkitAppearance: 'none',
						MozAppearance: 'textfield',
					}}
					/>

					{/* Max 按钮（若无则自动腾出空间） */}
					
					<button
						type="button"
						onClick={handleMax}
						className="
						ml-2 text-sm text-black/80
						border border-black/10 rounded-full px-3 py-0.5
						hover:bg-black/5 transition
						shrink-0
						"
					>
						{t('最大', 'Max', '最大')}
					</button>
					
				</div>
			</div>
			
			<SelectWallet />
			
		</div>
	)

}

export default Transfer