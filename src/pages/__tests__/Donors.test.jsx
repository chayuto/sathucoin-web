import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import Donors from "../Donors";

vi.mock("../../hooks/useDeedEvents", () => ({
  useDeedEvents: () => ({ deeds: [], isLoading: false, isError: false }),
}));

vi.mock("../../hooks/useAddToMetaMask", () => ({
  useAddToMetaMask: () => ({ addToken: vi.fn(), isAvailable: true }),
}));

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: undefined, isConnected: false }),
  useReadContract: () => ({ data: undefined, isLoading: false, isError: false }),
}));

vi.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: () => <div data-testid="connect-button">ConnectButton</div>,
}));

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const renderDonors = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <Donors />
      </MemoryRouter>
    </I18nextProvider>,
  );

describe("Donors", () => {
  it("renders title", () => {
    renderDonors();
    expect(screen.getByText("For Donors")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    renderDonors();
    expect(screen.getByText("Check your SaThuCoin balance and deed history")).toBeInTheDocument();
  });

  it("renders balance section heading", () => {
    renderDonors();
    expect(screen.getByText("Check Your Balance")).toBeInTheDocument();
  });

  it("renders deed history heading", () => {
    renderDonors();
    expect(screen.getByText("Deed History")).toBeInTheDocument();
  });

  it("renders wallet setup guide with 5 steps", () => {
    renderDonors();
    expect(screen.getByText("Wallet Setup Guide")).toBeInTheDocument();
    expect(screen.getByText(/Install MetaMask/)).toBeInTheDocument();
    expect(screen.getByText(/Create a wallet/)).toBeInTheDocument();
    expect(screen.getByText(/Copy your wallet address/)).toBeInTheDocument();
    expect(screen.getByText(/Share your address/)).toBeInTheDocument();
    expect(screen.getByText(/tokens appear in your wallet/)).toBeInTheDocument();
  });

  it("renders Add to MetaMask section", () => {
    renderDonors();
    expect(screen.getByText("Add SATHU to MetaMask")).toBeInTheDocument();
    expect(screen.getByText("Add to MetaMask")).toBeInTheDocument();
  });

  it("renders FAQ with 5 questions", () => {
    renderDonors();
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText("Does this cost me anything?")).toBeInTheDocument();
    expect(screen.getByText("What can I do with SATHU?")).toBeInTheDocument();
    expect(screen.getByText("Which network is this on?")).toBeInTheDocument();
    expect(screen.getByText("Is my Ethereum address the same as my Base address?")).toBeInTheDocument();
    expect(screen.getByText("I don't see my tokens?")).toBeInTheDocument();
  });

  it("FAQ toggle: click question expands answer container", () => {
    renderDonors();
    const question = screen.getByText("Does this cost me anything?");

    // Answer is in DOM but container has max-h-0
    const answer = screen.getByText(/SaThuCoin is given to you as recognition/);
    expect(answer.closest("div").className).toContain("max-h-0");

    // Click to expand - container gets max-h-40
    fireEvent.click(question);
    expect(answer.closest("div").className).toContain("max-h-40");
  });
});
