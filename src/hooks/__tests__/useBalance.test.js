import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBalance } from "../useBalance";

const mockUseReadContract = vi.fn();

vi.mock("wagmi", () => ({
  useReadContract: (...args) => mockUseReadContract(...args),
}));

describe("useBalance", () => {
  beforeEach(() => {
    mockUseReadContract.mockReset();
  });

  it("returns balance data when address is provided", () => {
    mockUseReadContract.mockReturnValue({
      data: 5000000000000000000n,
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() =>
      useBalance("0x1234567890abcdef1234567890abcdef12345678"),
    );

    expect(result.current.balance).toBe(5000000000000000000n);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("returns isLoading true during fetch", () => {
    mockUseReadContract.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(() =>
      useBalance("0x1234567890abcdef1234567890abcdef12345678"),
    );

    expect(result.current.isLoading).toBe(true);
  });

  it("returns isError true on failure", () => {
    mockUseReadContract.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    const { result } = renderHook(() =>
      useBalance("0x1234567890abcdef1234567890abcdef12345678"),
    );

    expect(result.current.isError).toBe(true);
  });

  it("disables query when address is falsy", () => {
    mockUseReadContract.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    renderHook(() => useBalance(null));

    expect(mockUseReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { enabled: false },
      }),
    );
  });
});
