import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders contract address link", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </I18nextProvider>,
    );
    expect(screen.getByText("0x974F...8AbD")).toBeInTheDocument();
    const link = screen.getByText("0x974F...8AbD").closest("a");
    expect(link).toHaveAttribute(
      "href",
      "https://basescan.org/address/0x974FCaC6add872B946917eD932581CA9f7188AbD",
    );
  });

  it("renders GitHub link", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </I18nextProvider>,
    );
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });
});
