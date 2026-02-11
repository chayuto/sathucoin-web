import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatUnits } from "viem";
import { useTokenStats } from "../hooks/useTokenStats";
import DeedList from "../components/DeedList";
import { CONTRACT_ADDRESS, BASESCAN_URL, TOKEN_DECIMALS } from "../config";

export default function Stats() {
  const { t } = useTranslation();
  const {
    totalSupply,
    totalSupplyFormatted,
    cap,
    capFormatted,
    dailyMinted,
    dailyMintedFormatted,
    maxDailyMint,
    maxDailyMintFormatted,
  } = useTokenStats();

  const supplyData = totalSupply !== undefined && cap !== undefined
    ? [
        { name: t("stats.minted"), value: Number(formatUnits(totalSupply, TOKEN_DECIMALS)) },
        { name: t("stats.remaining"), value: Number(formatUnits(cap - totalSupply, TOKEN_DECIMALS)) },
      ]
    : [];

  const dailyPercentage =
    dailyMinted !== undefined && maxDailyMint !== undefined && maxDailyMint > 0n
      ? (Number(dailyMinted) / Number(maxDailyMint)) * 100
      : 0;

  const COLORS = ["#0052FF", "#E5E7EB"];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("stats.title")}</h1>
        <p className="mt-2 text-gray-600">{t("stats.subtitle")}</p>
      </div>

      {/* Supply Chart */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("stats.supply_chart_title")}</h2>
        {supplyData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={supplyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {supplyData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t("common.loading")}</p>
        )}
      </section>

      {/* Daily Mint Progress */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("stats.daily_mint_title")}</h2>
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>{t("stats.daily_minted")}: {dailyMintedFormatted || "0"} SATHU</span>
          <span>{t("stats.daily_limit")}: {maxDailyMintFormatted || t("common.loading")} SATHU</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-sathu-gold transition-all duration-500"
            style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
          />
        </div>
      </section>

      {/* Recent Deeds */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("stats.recent_deeds_title")}</h2>
        <DeedList limit={20} />
      </section>

      {/* Contract Info */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("stats.contract_info_title")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 pr-4 font-medium text-gray-500">{t("stats.contract_address")}</td>
                <td className="py-3">
                  <a
                    href={`${BASESCAN_URL}/address/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-blue hover:underline break-all"
                  >
                    {CONTRACT_ADDRESS}
                  </a>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 pr-4 font-medium text-gray-500">{t("stats.chain")}</td>
                <td className="py-3 text-gray-700">{t("stats.chain_value")}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 pr-4 font-medium text-gray-500">{t("stats.supply_cap")}</td>
                <td className="py-3 text-gray-700">{capFormatted ? `${capFormatted} SATHU` : t("common.loading")}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 pr-4 font-medium text-gray-500">{t("stats.daily_limit_label")}</td>
                <td className="py-3 text-gray-700">{maxDailyMintFormatted ? `${maxDailyMintFormatted} SATHU` : t("common.loading")}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 pr-4 font-medium text-gray-500">{t("stats.per_tx_limit")}</td>
                <td className="py-3 text-gray-700">10,000 SATHU</td>
              </tr>
            </tbody>
          </table>
        </div>
        <a
          href={`${BASESCAN_URL}/address/${CONTRACT_ADDRESS}#code`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-base-blue hover:underline"
        >
          {t("stats.verified_source")}
        </a>
      </section>
    </div>
  );
}
