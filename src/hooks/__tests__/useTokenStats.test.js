import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTokenStats } from "../useTokenStats";

const mockUseReadContract = vi.fn();

vi.mock("wagmi", () => ({
  useReadContract: (...args) => mockUseReadContract(...args),
}));

describe("useTokenStats", () => {
  beforeEach(() => {
    mockUseReadContract.mockReset();
  });

  it("returns all formatted fields when data is available", () => {
    mockUseReadContract.mockImplementation(({ functionName }) => {
      const values = {
        totalSupply: { data: 1000000000000000000n },
        cap: { data: 1000000000000000000000000000n },
        paused: { data: false },
        dailyMintedToday: { data: 0n },
        MAX_DAILY_MINT: { data: 500000000000000000000000n },
      };
      return values[functionName] || { data: undefined };
    });

    const { result } = renderHook(() => useTokenStats());

    expect(result.current.totalSupply).toBe(1000000000000000000n);
    expect(result.current.totalSupplyFormatted).toBe("1");
    expect(result.current.cap).toBe(1000000000000000000000000000n);
    expect(result.current.capFormatted).toBeDefined();
    expect(result.current.paused).toBe(false);
    expect(result.current.dailyMintedFormatted).toBe("0");
    expect(result.current.maxDailyMintFormatted).toBeDefined();
  });

  it("returns undefined for formatted fields when raw data is undefined", () => {
    mockUseReadContract.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => useTokenStats());

    expect(result.current.totalSupplyFormatted).toBeUndefined();
    expect(result.current.capFormatted).toBeUndefined();
    expect(result.current.dailyMintedFormatted).toBeUndefined();
    expect(result.current.maxDailyMintFormatted).toBeUndefined();
  });

  it("paused returns boolean directly without formatting", () => {
    mockUseReadContract.mockImplementation(({ functionName }) => {
      if (functionName === "paused") return { data: true };
      return { data: undefined };
    });

    const { result } = renderHook(() => useTokenStats());
    expect(result.current.paused).toBe(true);
  });

  it("format handles zero values", () => {
    mockUseReadContract.mockImplementation(({ functionName }) => {
      if (functionName === "totalSupply") return { data: 0n };
      return { data: undefined };
    });

    const { result } = renderHook(() => useTokenStats());
    expect(result.current.totalSupplyFormatted).toBe("0");
  });

  it("format handles large numbers", () => {
    mockUseReadContract.mockImplementation(({ functionName }) => {
      if (functionName === "totalSupply") return { data: 999999000000000000000000n };
      return { data: undefined };
    });

    const { result } = renderHook(() => useTokenStats());
    expect(result.current.totalSupplyFormatted).toContain("999");
  });

  it("format handles decimal values", () => {
    mockUseReadContract.mockImplementation(({ functionName }) => {
      // 1.5 SATHU
      if (functionName === "totalSupply") return { data: 1500000000000000000n };
      return { data: undefined };
    });

    const { result } = renderHook(() => useTokenStats());
    expect(result.current.totalSupplyFormatted).toBe("1.5");
  });

  it("makes 5 useReadContract calls", () => {
    mockUseReadContract.mockReturnValue({ data: undefined });

    renderHook(() => useTokenStats());

    expect(mockUseReadContract).toHaveBeenCalledTimes(5);
    const functionNames = mockUseReadContract.mock.calls.map((c) => c[0].functionName);
    expect(functionNames).toContain("totalSupply");
    expect(functionNames).toContain("cap");
    expect(functionNames).toContain("paused");
    expect(functionNames).toContain("dailyMintedToday");
    expect(functionNames).toContain("MAX_DAILY_MINT");
  });
});
