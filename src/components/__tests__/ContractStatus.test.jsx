import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import ContractStatus from "../ContractStatus";

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe("ContractStatus", () => {
  it("returns null when paused is undefined", () => {
    const { container } = render(<ContractStatus paused={undefined} />, {
      wrapper,
    });
    expect(container.innerHTML).toBe("");
  });

  it("shows Active with green styling when paused=false", () => {
    render(<ContractStatus paused={false} />, { wrapper });
    expect(screen.getByText("Active")).toBeInTheDocument();
    const badge = screen.getByText("Active").closest("span");
    expect(badge.className).toContain("green");
  });

  it("shows Paused with red styling when paused=true", () => {
    render(<ContractStatus paused={true} />, { wrapper });
    expect(screen.getByText("Paused")).toBeInTheDocument();
    const badge = screen.getByText("Paused").closest("span");
    expect(badge.className).toContain("red");
  });
});
