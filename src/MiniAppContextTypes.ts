// src/types/miniapp/MiniAppContextTypes.ts

// Mini App 运行环境（Base Mini App / Web / 内嵌等）
export type MiniAppEnvironment = 'base-miniapp' | 'web' | 'embedded'

// 主题模式
export type MiniAppTheme = 'light' | 'dark' | 'system'

// 支持的网络（你可以根据需要增减）
export type MiniAppNetwork = 'base-mainnet' | 'base-sepolia' | 'unknown'

// 语言
export type MiniAppLocale = 'en' | 'zh' | 'ja' | 'system'

// Mini App 本身的静态信息（和 farcaster.json / heroImageUrl 对应）
export interface MiniAppMetadata {
  id: string                  // 例如 'beamio-mini-app'
  name: string                // 显示名称，例如 'Beamio · Mini App'
  description: string         // 不含特殊符号的简介（符合 Base/Farcaster 要求）
  heroImageUrl?: string       // 用于 Base Mini App 的 hero banner
  iconUrl?: string            // 小图标，可选
  homepageUrl?: string        // 官方站点，例如 https://beamio.app
}

// 链接 / 合约相关信息
export interface MiniAppChainConfig {
  network: MiniAppNetwork
  chainId: number             // 例如 Base mainnet = 8453
  rpcUrl?: string             // 你自己的 RPC / 代理
  usdcContractAddress?: string
  miniAppContractAddress?: string  // 与 Mini App 交互的主合约（如果有）
}

// Farcaster / Frame 相关用户信息（如需要）
export interface MiniAppFarcasterUser {
  fid: number
  username?: string
  displayName?: string
  avatarUrl?: string
}

// 登录用户信息（钱包地址等）
export interface MiniAppUser {
  address?: string
  ensName?: string
  isConnected: boolean
  farcaster?: MiniAppFarcasterUser
}

// UI 层状态
export interface MiniAppUiState {
  theme: MiniAppTheme
  locale: MiniAppLocale

  isReady: boolean           // context 初始化完成
  isLoading: boolean         // 全局 loading（初始化或关键请求中）
  environment: MiniAppEnvironment
}

// 常用操作
export interface MiniAppActions {
  // 切换主题
  setTheme: (theme: MiniAppTheme) => void

  // 切换语言
  setLocale: (locale: MiniAppLocale) => void

  // 连接 / 断开钱包（在 Mini App 或 Web 环境中）
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>

  // 打开外部链接（Base Mini App 内可用特定 API，Web 环境则 window.open）
  openExternalUrl: (url: string) => void

  // 跟踪事件，方便埋点 / 分析
  trackEvent: (event: string, payload?: Record<string, unknown>) => void
}

// 最终暴露给 React Context 的值
export interface MiniAppContextValue {
  metadata: MiniAppMetadata
  chain: MiniAppChainConfig
  user: MiniAppUser
  ui: MiniAppUiState
  actions: MiniAppActions
}
