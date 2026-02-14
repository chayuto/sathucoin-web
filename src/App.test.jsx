import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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
  beforeEach(() => {
    window.history.pushState({}, "", "/sathucoin-web/");
  });

  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getAllByText("SaThuCoin").length).toBeGreaterThan(0);
  });
});
