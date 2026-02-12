import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDeedEvents } from "../useDeedEvents";

const mockGetLogs = vi.fn();
const mockGetBlockNumber = vi.fn();
const mockUsePublicClient = vi.fn();

vi.mock("wagmi", () => ({
  usePublicClient: (...args) => mockUsePublicClient(...args),
}));

describe("useDeedEvents", () => {
  beforeEach(() => {
    mockGetLogs.mockReset();
    mockGetBlockNumber.mockReset();
    mockGetBlockNumber.mockResolvedValue(42009325n);
    mockUsePublicClient.mockReset();
  });

  it("returns empty deeds initially and populates after fetch", async () => {
    const logs = [
      {
        args: { recipient: "0xaaa", amount: 1000000000000000000n, deed: "Donation 1" },
        transactionHash: "0xtx1",
        blockNumber: 42000001n,
      },
      {
        args: { recipient: "0xbbb", amount: 2000000000000000000n, deed: "Donation 2" },
        transactionHash: "0xtx2",
        blockNumber: 42000002n,
      },
    ];
    mockGetLogs.mockResolvedValue(logs);
    mockUsePublicClient.mockReturnValue({ getLogs: mockGetLogs, getBlockNumber: mockGetBlockNumber });

    const { result } = renderHook(() => useDeedEvents());

    // Initially empty
    expect(result.current.deeds).toEqual([]);

    await waitFor(() => {
      expect(result.current.deeds.length).toBe(2);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("parses logs into correct shape", async () => {
    const logs = [
      {
        args: { recipient: "0xaaa", amount: 1000000000000000000n, deed: "Test Deed" },
        transactionHash: "0xtxhash",
        blockNumber: 42000001n,
      },
    ];
    mockGetLogs.mockResolvedValue(logs);
    mockUsePublicClient.mockReturnValue({ getLogs: mockGetLogs, getBlockNumber: mockGetBlockNumber });

    const { result } = renderHook(() => useDeedEvents());

    await waitFor(() => {
      expect(result.current.deeds.length).toBe(1);
    });

    expect(result.current.deeds[0]).toEqual({
      recipient: "0xaaa",
      amount: 1000000000000000000n,
      deed: "Test Deed",
      transactionHash: "0xtxhash",
      blockNumber: 42000001n,
    });
  });

  it("reverses log order (newest first)", async () => {
    const logs = [
      {
        args: { recipient: "0xaaa", amount: 1n, deed: "First" },
        transactionHash: "0xtx1",
        blockNumber: 1n,
      },
      {
        args: { recipient: "0xbbb", amount: 2n, deed: "Second" },
        transactionHash: "0xtx2",
        blockNumber: 2n,
      },
    ];
    mockGetLogs.mockResolvedValue(logs);
    mockUsePublicClient.mockReturnValue({ getLogs: mockGetLogs, getBlockNumber: mockGetBlockNumber });

    const { result } = renderHook(() => useDeedEvents());

    await waitFor(() => {
      expect(result.current.deeds.length).toBe(2);
    });

    expect(result.current.deeds[0].deed).toBe("Second");
    expect(result.current.deeds[1].deed).toBe("First");
  });

  it("filters by address when provided", async () => {
    mockGetLogs.mockResolvedValue([]);
    mockUsePublicClient.mockReturnValue({ getLogs: mockGetLogs, getBlockNumber: mockGetBlockNumber });

    renderHook(() => useDeedEvents("0xfilteraddr"));

    await waitFor(() => {
      expect(mockGetLogs).toHaveBeenCalled();
    });

    expect(mockGetLogs).toHaveBeenCalledWith(
      expect.objectContaining({
        args: { recipient: "0xfilteraddr" },
      }),
    );
  });

  it("sets isError true on fetch failure", async () => {
    mockGetLogs.mockRejectedValue(new Error("RPC error"));
    mockUsePublicClient.mockReturnValue({ getLogs: mockGetLogs, getBlockNumber: mockGetBlockNumber });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useDeedEvents());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.deeds).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    console.error.mockRestore();
  });
});
