import { describe, it, expect, beforeAll } from "vitest";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { CONTRACT_ADDRESS, DEPLOYMENT_BLOCK } from "../../config";
import { formatTokenAmount } from "../../utils/formatAmount";
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

describe("DeedRewarded events (on-chain)", () => {
  let logs;

  beforeAll(async () => {
    logs = await fetchLogsChunked();
  });

  it("fetches at least one DeedRewarded event", () => {
    expect(logs.length).toBeGreaterThan(0);
  });

  it("each event has the expected data shape", () => {
    for (const log of logs) {
      // args
      expect(log.args.recipient).toMatch(/^0x[0-9a-fA-F]{40}$/);
      expect(typeof log.args.amount).toBe("bigint");
      expect(log.args.amount).toBeGreaterThan(0n);
      expect(typeof log.args.deed).toBe("string");
      expect(log.args.deed.length).toBeGreaterThan(0);

      // tx metadata
      expect(log.transactionHash).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(typeof log.blockNumber).toBe("bigint");
      expect(log.blockNumber).toBeGreaterThanOrEqual(DEPLOYMENT_BLOCK);
    }
  });

  it("formatTokenAmount produces valid output for real amounts", () => {
    for (const log of logs) {
      const { value, unit } = formatTokenAmount(log.args.amount);
      expect(["SATHU", "boon"]).toContain(unit);
      expect(value).toBeTruthy();
      // Should never show "0" for a non-zero on-chain amount
      expect(value).not.toBe("0");
    }
  });
});

describe("Token contract reads (on-chain)", () => {
  it("totalSupply returns a positive bigint", async () => {
    const totalSupply = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "totalSupply",
    });

    expect(typeof totalSupply).toBe("bigint");
    expect(totalSupply).toBeGreaterThan(0n);
  });

  it("cap returns a bigint greater than totalSupply", async () => {
    const [cap, totalSupply] = await Promise.all([
      client.readContract({ address: CONTRACT_ADDRESS, abi, functionName: "cap" }),
      client.readContract({ address: CONTRACT_ADDRESS, abi, functionName: "totalSupply" }),
    ]);

    expect(typeof cap).toBe("bigint");
    expect(cap).toBeGreaterThan(0n);
    expect(cap).toBeGreaterThanOrEqual(totalSupply);
  });

  it("paused returns a boolean", async () => {
    const paused = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "paused",
    });

    expect(typeof paused).toBe("boolean");
  });

  it("MAX_DAILY_MINT returns a positive bigint", async () => {
    const maxDailyMint = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "MAX_DAILY_MINT",
    });

    expect(typeof maxDailyMint).toBe("bigint");
    expect(maxDailyMint).toBeGreaterThan(0n);
  });
});
