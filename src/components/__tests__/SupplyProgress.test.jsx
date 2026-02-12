import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import SupplyProgress from "../SupplyProgress";

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe("SupplyProgress", () => {
  it("returns null when totalSupply is undefined", () => {
    const { container } = render(
      <SupplyProgress totalSupply={undefined} cap={1000n} />,
      { wrapper },
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null when cap is undefined", () => {
    const { container } = render(
      <SupplyProgress totalSupply={100n} cap={undefined} />,
      { wrapper },
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders percentage text for given totalSupply/cap", () => {
    // 1/1000000 = 0.0001%
    render(<SupplyProgress totalSupply={1n} cap={1000000n} />, { wrapper });
    expect(screen.getByText("0.0001%")).toBeInTheDocument();
  });

  it("progress bar width is clamped to at least 1%", () => {
    const { container } = render(
      <SupplyProgress totalSupply={1n} cap={1000000000n} />,
      { wrapper },
    );
    // The inner progress bar div
    const bar = container.querySelector("[style]");
    expect(bar.style.width).toBe("1%");
  });
});
