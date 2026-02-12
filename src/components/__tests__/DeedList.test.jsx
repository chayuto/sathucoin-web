import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import DeedList from "../DeedList";

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

const makeDeed = (overrides = {}) => ({
  recipient: "0x1234567890abcdef1234567890abcdef12345678",
  amount: 1000000000000000000n, // 1 SATHU
  deed: "Test donation",
  transactionHash: "0xabc123",
  blockNumber: 42000000n,
  ...overrides,
});

describe("DeedList", () => {
  it("shows loading spinner when loading", () => {
    const { container } = render(<DeedList deeds={[]} loading={true} />, {
      wrapper,
    });
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows empty state when no deeds", () => {
    render(<DeedList deeds={[]} loading={false} />, { wrapper });
    expect(screen.getByText("No deeds found for this address")).toBeInTheDocument();
  });

  it("renders deed card with text, amount, and block number", () => {
    render(<DeedList deeds={[makeDeed()]} loading={false} />, { wrapper });
    expect(screen.getByText("Test donation")).toBeInTheDocument();
    expect(screen.getByText(/1 SATHU/)).toBeInTheDocument();
    expect(screen.getByText(/Block #42000000/)).toBeInTheDocument();
  });

  it("shows boon for sub-SATHU amounts", () => {
    render(
      <DeedList deeds={[makeDeed({ amount: 5n })]} loading={false} />,
      { wrapper },
    );
    expect(screen.getByText(/5 boon/)).toBeInTheDocument();
  });

  it("renders BaseScan tx link", () => {
    render(<DeedList deeds={[makeDeed()]} loading={false} />, { wrapper });
    const link = screen.getByText("View transaction");
    expect(link.closest("a")).toHaveAttribute(
      "href",
      "https://basescan.org/tx/0xabc123",
    );
    expect(link.closest("a")).toHaveAttribute("target", "_blank");
  });

  it("truncates long deed text and expands on click", () => {
    const longText = "A".repeat(100);
    render(
      <DeedList deeds={[makeDeed({ deed: longText })]} loading={false} />,
      { wrapper },
    );

    // Should be truncated
    expect(screen.queryByText(longText)).not.toBeInTheDocument();
    expect(screen.getByText("Show full text")).toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByText("Show full text"));
    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(screen.getByText("Show less")).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByText("Show less"));
    expect(screen.queryByText(longText)).not.toBeInTheDocument();
  });

  it("does not show expand button for short deed text", () => {
    render(
      <DeedList deeds={[makeDeed({ deed: "Short" })]} loading={false} />,
      { wrapper },
    );
    expect(screen.queryByText("Show full text")).not.toBeInTheDocument();
  });

  it("respects the limit prop", () => {
    const deeds = Array.from({ length: 5 }, (_, i) =>
      makeDeed({ deed: `Deed ${i}`, transactionHash: `0x${i}` }),
    );
    render(<DeedList deeds={deeds} loading={false} limit={3} />, { wrapper });

    expect(screen.getByText("Deed 0")).toBeInTheDocument();
    expect(screen.getByText("Deed 2")).toBeInTheDocument();
    expect(screen.queryByText("Deed 3")).not.toBeInTheDocument();
  });

  it("defaults to limit of 10", () => {
    const deeds = Array.from({ length: 15 }, (_, i) =>
      makeDeed({ deed: `Deed ${i}`, transactionHash: `0x${i}` }),
    );
    render(<DeedList deeds={deeds} loading={false} />, { wrapper });

    expect(screen.getByText("Deed 9")).toBeInTheDocument();
    expect(screen.queryByText("Deed 10")).not.toBeInTheDocument();
  });
});
