import { CONTRACT_ADDRESS, TOKEN_DECIMALS, TOKEN_SYMBOL } from "../config";

export function useAddToMetaMask() {
  const isAvailable = typeof window !== "undefined" && !!window.ethereum;

  const addToken = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: CONTRACT_ADDRESS,
            symbol: TOKEN_SYMBOL,
            decimals: TOKEN_DECIMALS,
          },
        },
      });
    } catch (err) {
      console.error("Failed to add token to wallet:", err);
    }
  };

  return { addToken, isAvailable };
}
