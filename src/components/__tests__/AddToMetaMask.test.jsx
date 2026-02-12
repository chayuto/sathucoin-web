import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import AddToMetaMask from "../AddToMetaMask";

const mockAddToken = vi.fn();
const mockUseAddToMetaMask = vi.fn();

vi.mock("../../hooks/useAddToMetaMask", () => ({
  useAddToMetaMask: (...args) => mockUseAddToMetaMask(...args),
}));

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe("AddToMetaMask", () => {
  it("returns null when isAvailable is false", () => {
    mockUseAddToMetaMask.mockReturnValue({ addToken: mockAddToken, isAvailable: false });
    const { container } = render(<AddToMetaMask />, { wrapper });
    expect(container.innerHTML).toBe("");
  });

  it("renders button with Add to MetaMask text when available", () => {
    mockUseAddToMetaMask.mockReturnValue({ addToken: mockAddToken, isAvailable: true });
    render(<AddToMetaMask />, { wrapper });
    expect(screen.getByText("Add to MetaMask")).toBeInTheDocument();
  });

  it("calls addToken on click", () => {
    mockUseAddToMetaMask.mockReturnValue({ addToken: mockAddToken, isAvailable: true });
    render(<AddToMetaMask />, { wrapper });

    fireEvent.click(screen.getByText("Add to MetaMask"));
    expect(mockAddToken).toHaveBeenCalled();
  });
});
