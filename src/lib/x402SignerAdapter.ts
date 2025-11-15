import type { WalletClient } from "viem";

export type X402Signer = {
  getAddress: () => Promise<`0x${string}`>;
  getChainId: () => Promise<number>;
  signMessage: (message: string | Uint8Array) => Promise<`0x${string}`>;
};

export function viemWalletToX402Signer(walletClient: WalletClient): X402Signer {
  if (!walletClient?.account?.address) {
    throw new Error("x402 signer adapter: walletClient.account.address missing");
  }
  const addr = walletClient.account.address as `0x${string}`;
  const chainId = walletClient.chain?.id ?? 8453;

  return {
    async getAddress() {
      return addr;
    },
    async getChainId() {
      return chainId;
    },
    async signMessage(message: string | Uint8Array) {
      const params =
        typeof message === "string"
          ? { message }                        // 直接字符串
          : { message: { raw: message as Uint8Array } }; // 原始字节需包成 raw

      const sig = await walletClient.signMessage({
        account: addr,
        ...(params as any),
      });

      return sig as `0x${string}`;
    },
  };
}
