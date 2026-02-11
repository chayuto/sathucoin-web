import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS } from "../config";
import abi from "../abi/SaThuCoin.json";

export function useBalance(address) {
  const { data, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    balance: data,
    isLoading,
    isError,
  };
}
