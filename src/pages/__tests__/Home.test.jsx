import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import Home from "../Home";

vi.mock("../../hooks/useTokenStats", () => ({
  useTokenStats: () => ({
    totalSupply: 1000000000000000000000n,
    totalSupplyFormatted: "1,000",
    cap: 1000000000000000000000000000n,
    capFormatted: "1,000,000,000",
    paused: false,
    dailyMinted: 0n,
    dailyMintedFormatted: "0",
    maxDailyMint: 500000000000000000000000n,
    maxDailyMintFormatted: "500,000",
  }),
}));

describe("Home", () => {
  it("renders hero tagline", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </I18nextProvider>,
    );
    expect(
      screen.getByText("Every token represents a verified act of generosity"),
    ).toBeInTheDocument();
  });

  it("renders navigation cards", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </I18nextProvider>,
    );
    expect(screen.getByText("I'm a Donor")).toBeInTheDocument();
    expect(screen.getByText("I'm an Institution")).toBeInTheDocument();
    expect(screen.getByText("View Token Stats")).toBeInTheDocument();
  });
});
