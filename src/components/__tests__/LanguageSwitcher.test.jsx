import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import LanguageSwitcher from "../LanguageSwitcher";

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    i18n.changeLanguage("en");
  });

  it("shows TH when current language is English", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>,
    );
    expect(screen.getByText("TH")).toBeInTheDocument();
  });

  it("switches to Thai when clicked", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>,
    );
    fireEvent.click(screen.getByText("TH"));
    expect(i18n.language).toBe("th");
    expect(screen.getByText("EN")).toBeInTheDocument();
  });
});
