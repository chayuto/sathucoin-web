import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import BalanceChecker from "../BalanceChecker";

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: undefined, isConnected: false }),
}));

const mockUseBalance = vi.fn();
vi.mock("../../hooks/useBalance", () => ({
  useBalance: (...args) => mockUseBalance(...args),
}));

vi.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: () => <div data-testid="connect-button">ConnectButton</div>,
}));

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe("BalanceChecker", () => {
  it("renders input and check button", () => {
    mockUseBalance.mockReturnValue({ balance: undefined, isLoading: false });
    render(<BalanceChecker />, { wrapper });

    expect(screen.getByPlaceholderText("0x...")).toBeInTheDocument();
    expect(screen.getByText("Check Balance")).toBeInTheDocument();
  });

  it("shows error for invalid address", () => {
    mockUseBalance.mockReturnValue({ balance: undefined, isLoading: false });
    render(<BalanceChecker />, { wrapper });

    const input = screen.getByPlaceholderText("0x...");
    fireEvent.change(input, { target: { value: "invalid" } });
    fireEvent.click(screen.getByText("Check Balance"));

    expect(screen.getByText("Please enter a valid Ethereum address")).toBeInTheDocument();
  });

  it("shows balance when valid address checked", () => {
    mockUseBalance.mockReturnValue({
      balance: 5000000000000000000n,
      isLoading: false,
    });

    render(<BalanceChecker />, { wrapper });

    const input = screen.getByPlaceholderText("0x...");
    fireEvent.change(input, {
      target: { value: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
    });
    fireEvent.click(screen.getByText("Check Balance"));

    expect(screen.getByText(/5 SATHU/)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseBalance.mockReturnValue({ balance: undefined, isLoading: true });

    render(<BalanceChecker />, { wrapper });

    const input = screen.getByPlaceholderText("0x...");
    fireEvent.change(input, {
      target: { value: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
    });
    fireEvent.click(screen.getByText("Check Balance"));

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders ConnectButton", () => {
    mockUseBalance.mockReturnValue({ balance: undefined, isLoading: false });
    render(<BalanceChecker />, { wrapper });

    expect(screen.getByTestId("connect-button")).toBeInTheDocument();
  });

  it("displays formatted balance with SATHU suffix", () => {
    mockUseBalance.mockReturnValue({
      balance: 1500000000000000000n,
      isLoading: false,
    });

    render(<BalanceChecker />, { wrapper });

    const input = screen.getByPlaceholderText("0x...");
    fireEvent.change(input, {
      target: { value: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
    });
    fireEvent.click(screen.getByText("Check Balance"));

    expect(screen.getByText(/1\.5 SATHU/)).toBeInTheDocument();
  });

  it("shows BaseScan link with correct address", () => {
    mockUseBalance.mockReturnValue({
      balance: 1000000000000000000n,
      isLoading: false,
    });

    render(<BalanceChecker />, { wrapper });

    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const input = screen.getByPlaceholderText("0x...");
    fireEvent.change(input, { target: { value: address } });
    fireEvent.click(screen.getByText("Check Balance"));

    const link = screen.getByText("View on BaseScan →");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(address),
    );
  });
});
