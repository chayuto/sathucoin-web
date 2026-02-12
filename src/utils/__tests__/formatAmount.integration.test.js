import { describe, it, expect, beforeAll } from "vitest";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { CONTRACT_ADDRESS, DEPLOYMENT_BLOCK } from "../../config";
import { formatTokenAmount } from "../formatAmount";
import abi from "../../abi/SaThuCoin.json";

const RPC_URL = process.env.BASE_RPC_URL || "https://base-rpc.publicnode.com";

const client = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

const deedRewardedEvent = abi.find(
  (item) => item.type === "event" && item.name === "DeedRewarded",
);

const CHUNK_SIZE = 50_000n;

/** Fetch logs in chunks to avoid public RPC block-range limits. */
async function fetchLogsChunked() {
  const latestBlock = await client.getBlockNumber();
  const allLogs = [];

  for (let from = DEPLOYMENT_BLOCK; from <= latestBlock; from += CHUNK_SIZE) {
    const to = from + CHUNK_SIZE - 1n > latestBlock ? latestBlock : from + CHUNK_SIZE - 1n;
    const logs = await client.getLogs({
      address: CONTRACT_ADDRESS,
      event: deedRewardedEvent,
      fromBlock: from,
      toBlock: to,
    });
    allLogs.push(...logs);
  }

  return allLogs;
}

describe("formatTokenAmount with real on-chain amounts", () => {
  let logs;

  beforeAll(async () => {
    logs = await fetchLogsChunked();
  });

  it("no real deed amount formats to '0 SATHU'", () => {
    expect(logs.length).toBeGreaterThan(0);

    for (const log of logs) {
      const { value, unit } = formatTokenAmount(log.args.amount);

      // A real non-zero amount should never display as "0 SATHU"
      if (unit === "SATHU") {
        expect(value).not.toBe("0");
      }

      // If shown in boon, the value should be a positive integer string
      if (unit === "boon") {
        expect(Number(value)).toBeGreaterThan(0);
      }
    }
  });

  it("formatted values are parseable numbers", () => {
    for (const log of logs) {
      const { value } = formatTokenAmount(log.args.amount);
      // Remove thousands separators before parsing
      const numeric = Number(value.replace(/,/g, ""));
      expect(numeric).toBeGreaterThan(0);
      expect(Number.isFinite(numeric)).toBe(true);
    }
  });
});
