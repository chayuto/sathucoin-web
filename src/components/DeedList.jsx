import { useTranslation } from "react-i18next";
import { formatUnits } from "viem";
import { useDeedEvents } from "../hooks/useDeedEvents";
import { BASESCAN_URL, TOKEN_DECIMALS } from "../config";

function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function DeedList({ address, limit }) {
  const { t } = useTranslation();
  const { deeds, isLoading } = useDeedEvents(address);

  if (isLoading) return <p className="text-sm text-gray-500">{t("common.loading")}</p>;

  const displayDeeds = limit ? deeds.slice(0, limit) : deeds;

  if (displayDeeds.length === 0) {
    return <p className="text-sm text-gray-500">{t("donors.no_deeds")}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {!address && <th className="pb-2 pr-4 font-medium text-gray-500">{t("stats.recipient")}</th>}
            <th className="pb-2 pr-4 font-medium text-gray-500">{t("donors.deed_name")}</th>
            <th className="pb-2 font-medium text-gray-500">{t("donors.deed_amount")}</th>
          </tr>
        </thead>
        <tbody>
          {displayDeeds.map((deed, i) => (
            <tr key={i} className="border-b border-gray-100">
              {!address && (
                <td className="py-2 pr-4">
                  <a
                    href={`${BASESCAN_URL}/address/${deed.recipient}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-blue hover:underline"
                  >
                    {truncateAddress(deed.recipient)}
                  </a>
                </td>
              )}
              <td className="py-2 pr-4 text-gray-700">{deed.deed}</td>
              <td className="py-2 text-gray-900 font-medium">
                {Number(formatUnits(deed.amount, TOKEN_DECIMALS)).toLocaleString(undefined, { maximumFractionDigits: 2 })} SATHU
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
