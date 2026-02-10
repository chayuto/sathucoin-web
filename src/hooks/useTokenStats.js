import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACT_ADDRESS, TOKEN_DECIMALS } from "../config";
import abi from "../abi/SaThuCoin.json";

export function useTokenStats() {
  const { data: totalSupplyRaw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "totalSupply",
  });

  const { data: capRaw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "cap",
  });

  const { data: paused } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "paused",
  });

  const { data: dailyMintedRaw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "dailyMintedToday",
  });

  const { data: maxDailyMintRaw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "MAX_DAILY_MINT",
  });

  const format = (val) =>
    val !== undefined
      ? Number(formatUnits(val, TOKEN_DECIMALS)).toLocaleString(undefined, { maximumFractionDigits: 2 })
      : undefined;

  return {
    totalSupply: totalSupplyRaw,
    totalSupplyFormatted: format(totalSupplyRaw),
    cap: capRaw,
    capFormatted: format(capRaw),
    paused,
    dailyMinted: dailyMintedRaw,
    dailyMintedFormatted: format(dailyMintedRaw),
    maxDailyMint: maxDailyMintRaw,
    maxDailyMintFormatted: format(maxDailyMintRaw),
  };
}
