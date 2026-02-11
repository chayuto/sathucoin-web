import { useTranslation } from "react-i18next";
import { CONTRACT_ADDRESS, BASESCAN_URL, GITHUB_URL } from "../config";

function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Footer() {
  const { t } = useTranslation();
  const coinSrc = `${import.meta.env.BASE_URL}assets/sathu_coin.png`;

  return (
    <footer className="bg-warm-900 text-warm-200">
      <div className="h-1 gradient-gold" />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          {/* Brand + contract */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <div className="flex items-center gap-2">
              <img src={coinSrc} alt={t("common.alt_token_icon")} className="h-6 w-6 object-contain opacity-80" />
              <span className="text-sm font-semibold text-sathu-gold">SaThuCoin</span>
            </div>
            <div className="text-xs text-warm-200/60">
              {t("common.contract_address")}:{" "}
              <a
                href={`${BASESCAN_URL}/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sathu-gold/80 hover:text-sathu-gold transition-colors"
              >
                {truncateAddress(CONTRACT_ADDRESS)}
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-xs text-warm-200/60">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-warm-200 transition-colors"
            >
              {t("common.github")}
            </a>
            <span className="text-warm-200/30">|</span>
            <span>&copy; 2026 {t("common.copyright")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
