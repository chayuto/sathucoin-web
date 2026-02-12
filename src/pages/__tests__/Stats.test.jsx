import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import Stats from "../Stats";

vi.mock("../../hooks/useTokenStats", () => ({
  useTokenStats: () => ({
    totalSupply: 1000000000000000000000n,
    totalSupplyFormatted: "1,000",
    cap: 1000000000000000000000000000n,
    capFormatted: "1,000,000,000",
    paused: false,
    dailyMinted: 100000000000000000000n,
    dailyMintedFormatted: "100",
    maxDailyMint: 500000000000000000000000n,
    maxDailyMintFormatted: "500,000",
  }),
}));

vi.mock("../../hooks/useDeedEvents", () => ({
  useDeedEvents: () => ({ deeds: [], isLoading: false, isError: false }),
}));

// Mock recharts to avoid rendering complexity
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div />,
  Legend: () => <div data-testid="legend" />,
}));

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const renderStats = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <Stats />
    </I18nextProvider>,
  );

describe("Stats", () => {
  it("renders title", () => {
    renderStats();
    expect(screen.getByText("Token Dashboard")).toBeInTheDocument();
  });

  it("renders supply chart section heading", () => {
    renderStats();
    expect(screen.getByText("Supply Distribution")).toBeInTheDocument();
  });

  it("renders daily mint section with formatted values", () => {
    renderStats();
    expect(screen.getByText("Daily Mint Progress")).toBeInTheDocument();
    expect(screen.getByText(/Minted Today.*100 SATHU/)).toBeInTheDocument();
    // "500,000 SATHU" appears in both the daily mint section and contract info
    expect(screen.getAllByText(/500,000 SATHU/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders contract info with contract address link", () => {
    renderStats();
    expect(screen.getByText("Contract Information")).toBeInTheDocument();
    const link = screen.getByText("0x974FCaC6add872B946917eD932581CA9f7188AbD");
    expect(link.closest("a")).toHaveAttribute(
      "href",
      expect.stringContaining("basescan.org"),
    );
  });

  it("renders recent deeds section heading", () => {
    renderStats();
    expect(screen.getByText("Recent Deeds")).toBeInTheDocument();
  });
});
