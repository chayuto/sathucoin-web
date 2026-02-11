import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { path: "/", key: "common.nav_home" },
  { path: "/donors", key: "common.nav_donors" },
  { path: "/institutions", key: "common.nav_institutions" },
  { path: "/stats", key: "common.nav_stats" },
  { path: "/about", key: "common.nav_about" },
];

const coinIconSrc = `${import.meta.env.BASE_URL}assets/sathu_coin.png`;

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-base-blue">
          <img
            src={coinIconSrc}
            alt={t("common.alt_token_icon")}
            className="h-8 w-8 object-contain"
          />
          SaThuCoin
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-base-blue"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-600"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-gray-200 px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-medium ${
                location.pathname === link.path
                  ? "text-base-blue"
                  : "text-gray-600"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
