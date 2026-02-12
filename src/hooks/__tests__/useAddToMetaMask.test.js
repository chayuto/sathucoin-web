import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAddToMetaMask } from "../useAddToMetaMask";
import { CONTRACT_ADDRESS, TOKEN_SYMBOL, TOKEN_DECIMALS } from "../../config";

describe("useAddToMetaMask", () => {
  const originalEthereum = globalThis.window?.ethereum;

  beforeEach(() => {
    // Ensure clean state
    delete window.ethereum;
  });

  afterEach(() => {
    if (originalEthereum) {
      window.ethereum = originalEthereum;
    } else {
      delete window.ethereum;
    }
  });

  it("isAvailable is true when window.ethereum exists", () => {
    window.ethereum = { request: vi.fn() };

    const { result } = renderHook(() => useAddToMetaMask());
    expect(result.current.isAvailable).toBe(true);
  });

  it("isAvailable is false when window.ethereum is undefined", () => {
    delete window.ethereum;

    const { result } = renderHook(() => useAddToMetaMask());
    expect(result.current.isAvailable).toBe(false);
  });

  it("addToken calls window.ethereum.request with correct params", async () => {
    const mockRequest = vi.fn().mockResolvedValue(true);
    window.ethereum = { request: mockRequest };

    const { result } = renderHook(() => useAddToMetaMask());

    await act(async () => {
      await result.current.addToken();
    });

    expect(mockRequest).toHaveBeenCalledWith({
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
  });

  it("addToken logs error on failure", async () => {
    const error = new Error("User rejected");
    window.ethereum = { request: vi.fn().mockRejectedValue(error) };
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useAddToMetaMask());

    await act(async () => {
      await result.current.addToken();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to add token to wallet:",
      error,
    );
    consoleSpy.mockRestore();
  });
});
