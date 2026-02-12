import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import Institutions from "../Institutions";

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const renderInstitutions = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <Institutions />
    </I18nextProvider>,
  );

describe("Institutions", () => {
  it("renders title", () => {
    renderInstitutions();
    expect(screen.getByText("For Institutions")).toBeInTheDocument();
  });

  it("renders What is SaThuCoin section", () => {
    renderInstitutions();
    expect(screen.getByText("What is SaThuCoin?")).toBeInTheDocument();
    expect(screen.getByText(/digital token that recognizes donors/)).toBeInTheDocument();
  });

  it("renders 4 how-it-works steps", () => {
    renderInstitutions();
    expect(screen.getByText(/Donors provide their wallet address/)).toBeInTheDocument();
    expect(screen.getByText(/institution reports the donation/)).toBeInTheDocument();
    expect(screen.getByText(/Tokens are minted and sent directly/)).toBeInTheDocument();
    expect(screen.getByText(/deed is recorded on-chain/)).toBeInTheDocument();
  });

  it("renders FAQ with 4 questions", () => {
    renderInstitutions();
    expect(screen.getByText("Do we need to handle cryptocurrency?")).toBeInTheDocument();
    expect(screen.getByText("Does the donor need to pay anything?")).toBeInTheDocument();
    expect(screen.getByText("How do we verify a token was sent?")).toBeInTheDocument();
    expect(screen.getByText("What wallet should we recommend to donors?")).toBeInTheDocument();
  });

  it("renders contract address in integration info", () => {
    renderInstitutions();
    const link = screen.getByText("0x974FCaC6add872B946917eD932581CA9f7188AbD");
    expect(link.closest("a")).toHaveAttribute(
      "href",
      expect.stringContaining("basescan.org"),
    );
  });
});
