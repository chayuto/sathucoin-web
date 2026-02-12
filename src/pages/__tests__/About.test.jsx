import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import About from "../About";

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

const renderAbout = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <About />
    </I18nextProvider>,
  );

describe("About", () => {
  it("renders title", () => {
    renderAbout();
    expect(screen.getByText("About SaThuCoin")).toBeInTheDocument();
  });

  it("renders mission section with 2 paragraphs", () => {
    renderAbout();
    expect(screen.getByText("Our Mission")).toBeInTheDocument();
    expect(screen.getByText(/transparent, permanent record of charitable giving/)).toBeInTheDocument();
    expect(screen.getByText(/leveraging blockchain technology/)).toBeInTheDocument();
  });

  it("renders 4 how-it-works steps", () => {
    renderAbout();
    expect(screen.getByText(/donor makes a contribution/)).toBeInTheDocument();
    expect(screen.getByText(/institution verifies the donation/)).toBeInTheDocument();
    expect(screen.getByText(/SATHU tokens are minted/)).toBeInTheDocument();
    expect(screen.getByText(/permanently recorded on the Base blockchain/)).toBeInTheDocument();
  });

  it("renders 2 resource links with correct hrefs", () => {
    renderAbout();
    const basescanLink = screen.getByText("View Contract on BaseScan").closest("a");
    expect(basescanLink).toHaveAttribute("href", expect.stringContaining("basescan.org"));

    const githubLink = screen.getByText("View Source on GitHub").closest("a");
    expect(githubLink).toHaveAttribute("href", expect.stringContaining("github.com"));
  });
});
