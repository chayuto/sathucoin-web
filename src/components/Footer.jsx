import { useTranslation } from "react-i18next";
import { CONTRACT_ADDRESS, BASESCAN_URL, GITHUB_URL } from "../config";

function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="text-sm text-gray-500">
            {t("common.contract_address")}:{" "}
            <a
              href={`${BASESCAN_URL}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-blue hover:underline"
            >
              {truncateAddress(CONTRACT_ADDRESS)}
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              {t("common.github")}
            </a>
            <span>&copy; 2026 {t("common.copyright")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
