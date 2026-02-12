import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import Navbar from "../Navbar";

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const renderNavbar = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </I18nextProvider>,
  );

describe("Navbar", () => {
  it("renders brand text", () => {
    renderNavbar();
    expect(screen.getByText("SaThuCoin")).toBeInTheDocument();
  });

  it("renders all 5 nav links", () => {
    renderNavbar();
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("For Donors").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("For Institutions").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Token Stats").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("About").length).toBeGreaterThanOrEqual(1);
  });

  it("mobile menu button has aria-label", () => {
    renderNavbar();
    expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
  });

  it("renders LanguageSwitcher", () => {
    renderNavbar();
    // When lang is "en", switcher shows "TH" (to switch to Thai)
    expect(screen.getAllByText("TH").length).toBeGreaterThanOrEqual(1);
  });

  it("renders coin icon img with alt text", () => {
    renderNavbar();
    const icons = screen.getAllByAltText("SATHU token icon");
    expect(icons.length).toBeGreaterThanOrEqual(1);
    expect(icons[0].tagName).toBe("IMG");
  });
});
