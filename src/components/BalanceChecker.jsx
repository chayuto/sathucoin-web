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
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder={t("donors.address_placeholder")}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-base-blue focus:outline-none focus:ring-1 focus:ring-base-blue"
        />
        <button
          onClick={handleCheck}
          className="rounded-lg bg-base-blue px-4 py-2 text-sm font-medium text-white hover:bg-base-blue-dark transition-colors"
        >
          {t("donors.check_balance")}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="text-center text-sm text-gray-500">{t("donors.or_connect")}</div>
      <div className="flex justify-center">
        <ConnectButton />
      </div>

      {activeAddress && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">{t("donors.your_balance")}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {isLoading ? t("common.loading") : `${displayBalance} SATHU`}
          </p>
          <a
            href={`${BASESCAN_URL}/token/${CONTRACT_ADDRESS}?a=${activeAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-base-blue hover:underline"
          >
            {t("common.view_on_basescan")}
          </a>
        </div>
      )}
    </div>
  );
}
