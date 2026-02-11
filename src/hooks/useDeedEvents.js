import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { CONTRACT_ADDRESS, DEPLOYMENT_BLOCK } from "../config";
import abi from "../abi/SaThuCoin.json";

const deedRewardedEvent = abi.find((item) => item.type === "event" && item.name === "DeedRewarded");

export function useDeedEvents(address) {
  const publicClient = usePublicClient();
  const [deeds, setDeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!publicClient) return;

    async function fetchDeeds() {
      setIsLoading(true);
      setIsError(false);
      try {
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: deedRewardedEvent,
          args: address ? { recipient: address } : undefined,
          fromBlock: DEPLOYMENT_BLOCK,
          toBlock: "latest",
        });

        const parsed = logs.map((log) => ({
          recipient: log.args.recipient,
          amount: log.args.amount,
          deed: log.args.deed,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        }));

        setDeeds(parsed.reverse());
      } catch (err) {
        console.error("Failed to fetch deed events:", err);
        setDeeds([]);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeeds();
  }, [publicClient, address]);

  return { deeds, isLoading, isError };
}
