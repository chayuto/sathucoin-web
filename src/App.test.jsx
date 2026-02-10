import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./hooks/useTokenStats", () => ({
  useTokenStats: () => ({
    totalSupply: undefined,
    totalSupplyFormatted: undefined,
    cap: undefined,
    capFormatted: undefined,
    paused: undefined,
    dailyMinted: undefined,
    dailyMintedFormatted: undefined,
    maxDailyMint: undefined,
    maxDailyMintFormatted: undefined,
  }),
}));

vi.mock("./hooks/useDeedEvents", () => ({
  useDeedEvents: () => ({ deeds: [], isLoading: false }),
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("SaThuCoin")).toBeInTheDocument();
  });
});
