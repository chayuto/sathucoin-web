import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isAddress, formatUnits } from "viem";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBalance } from "../hooks/useBalance";
import { BASESCAN_URL, CONTRACT_ADDRESS, TOKEN_DECIMALS } from "../config";

export default function BalanceChecker() {
  const { t } = useTranslation();
  const [inputAddress, setInputAddress] = useState("");
  const [checkedAddress, setCheckedAddress] = useState(null);
  const [error, setError] = useState("");
  const { address: connectedAddress, isConnected } = useAccount();
  const coinSrc = `${import.meta.env.BASE_URL}assets/sathu_coin.png`;

  const activeAddress = checkedAddress || (isConnected ? connectedAddress : null);
  const { balance, isLoading } = useBalance(activeAddress);

  const handleCheck = () => {
    if (!isAddress(inputAddress)) {
      setError(t("donors.invalid_address"));
      setCheckedAddress(null);
      return;
    }
    setError("");
    setCheckedAddress(inputAddress);
  };

  const displayBalance = balance !== undefined
    ? Number(formatUnits(balance, TOKEN_DECIMALS)).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : null;

  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder={t("donors.address_placeholder")}
          className="flex-1 rounded-xl border border-warm-200 bg-white/80 px-4 py-3 text-sm text-warm-900 placeholder-warm-800/40 shadow-sm focus:border-sathu-gold focus:outline-none focus:ring-2 focus:ring-sathu-gold/20 transition-all"
        />
        <button
          onClick={handleCheck}
          className="rounded-xl bg-base-blue px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-base-blue-dark hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          {t("donors.check_balance")}
        </button>
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      <div className="text-center text-sm text-warm-800/50">{t("donors.or_connect")}</div>
      <div className="flex justify-center">
        <ConnectButton />
      </div>

      {activeAddress && (
        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-sathu-gold">
          <p className="text-sm font-medium text-warm-800/60">{t("donors.your_balance")}</p>
          <div className="mt-2 flex items-center gap-3">
            <img src={coinSrc} alt={t("common.alt_token_icon")} className="h-8 w-8 object-contain animate-float" />
            <p className="text-3xl font-bold text-warm-900">
              {isLoading ? t("common.loading") : `${displayBalance} SATHU`}
            </p>
          </div>
          <a
            href={`${BASESCAN_URL}/token/${CONTRACT_ADDRESS}?a=${activeAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-base-blue hover:text-base-blue-dark transition-colors"
          >
            {t("common.view_on_basescan")} →
          </a>
        </div>
      )}
    </div>
  );
}
