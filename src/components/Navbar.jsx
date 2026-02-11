import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const coinSrc = `${import.meta.env.BASE_URL}assets/sathu_coin.png`;

  const linkClass = ({ isActive }) =>
    `relative px-1 py-1 text-sm font-medium transition-colors duration-200 ${isActive
      ? "text-sathu-gold"
      : "text-warm-800 hover:text-sathu-gold"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200 ${isActive
      ? "bg-sathu-gold-light text-sathu-gold-dark"
      : "text-warm-800 hover:bg-warm-100"
    }`;

  const links = [
    { to: "/", label: t("common.nav_home") },
    { to: "/donors", label: t("common.nav_donors") },
    { to: "/institutions", label: t("common.nav_institutions") },
    { to: "/stats", label: t("common.nav_stats") },
    { to: "/about", label: t("common.nav_about") },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-glass-border bg-glass-white-strong backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <img
            src={coinSrc}
            alt={t("common.alt_token_icon")}
            className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-xl font-bold text-warm-900 tracking-tight">
            SaThuCoin
          </span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-warm-800 hover:bg-warm-100 md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="border-t border-glass-border bg-glass-white-strong px-4 py-3 space-y-1 backdrop-blur-xl">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={mobileLinkClass}
              end={link.to === "/"}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 pb-1 px-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-0.5 gradient-gold" />
    </nav>
  );
}
