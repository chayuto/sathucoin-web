import { useTranslation } from "react-i18next";
import { formatUnits } from "viem";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { useTokenStats } from "../hooks/useTokenStats";
import { useDeedEvents } from "../hooks/useDeedEvents";
import DeedList from "../components/DeedList";
import { CONTRACT_ADDRESS, BASESCAN_URL, TOKEN_DECIMALS } from "../config";


export default function Stats() {
  const { t } = useTranslation();
  const { totalSupply, cap, maxDailyMint, dailyMinted, dailyMintedFormatted, maxDailyMintFormatted, capFormatted } = useTokenStats();
  const { deeds: recentDeeds, isLoading: deedsLoading } = useDeedEvents();
  const coinSrc = `${import.meta.env.BASE_URL}assets/sathu_coin.png`;

  const totalSupplyNum = totalSupply !== undefined ? Number(formatUnits(totalSupply, TOKEN_DECIMALS)) : 0;
  const capNum = cap !== undefined ? Number(formatUnits(cap, TOKEN_DECIMALS)) : 0;
  const remainingNum = capNum - totalSupplyNum;

  const dailyPercentage = maxDailyMint && dailyMinted
    ? (Number(dailyMinted) / Number(maxDailyMint)) * 100
    : 0;

  const chartData = [
    { name: t("stats.minted"), value: totalSupplyNum },
    { name: t("stats.remaining"), value: remainingNum },
  ];
  const COLORS = ["#0052FF", "#E5E7EB"];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-warm-900">{t("stats.title")}</h1>
        <p className="mt-2 text-warm-800/60">{t("stats.subtitle")}</p>
      </div>

      {/* Supply Chart */}
      <section className="glass-card rounded-2xl p-6 animate-fade-in-up-delay-1">
        <h2 className="gold-underline mb-6 text-lg font-bold text-warm-900">{t("stats.supply_chart_title")}</h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              formatter={(value) => (
                <span className="text-sm text-warm-800/70">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Daily Mint Progress */}
      <section className="glass-card rounded-2xl p-6 animate-fade-in-up-delay-2">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("stats.daily_mint_title")}</h2>
        <div className="mb-3 flex justify-between text-sm">
          <span className="flex items-center gap-1.5 text-warm-800/70">
            <img src={coinSrc} alt={t("common.alt_token_icon")} className="h-4 w-4 object-contain" />
            {t("stats.daily_minted")}: {dailyMintedFormatted || "0"} SATHU
          </span>
          <span className="flex items-center gap-1.5 text-warm-800/70">
            <img src={coinSrc} alt={t("common.alt_token_icon")} className="h-4 w-4 object-contain" />
            {t("stats.daily_limit")}: {maxDailyMintFormatted || t("common.loading")} SATHU
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-warm-200">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.max(Math.min(dailyPercentage, 100), 0.5)}%`,
              background: "linear-gradient(90deg, #0052FF, #F5A623)",
              boxShadow: "0 0 12px rgba(245, 166, 35, 0.3)",
            }}
          />
        </div>
      </section>

      {/* Recent Deeds */}
      <section className="animate-fade-in-up-delay-3">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("stats.recent_deeds_title")}</h2>
        <DeedList deeds={recentDeeds} loading={deedsLoading} />
      </section>

      {/* Contract Info */}
      <section className="glass-card rounded-2xl p-6">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("stats.contract_info_title")}</h2>
        <div className="space-y-3">
          {[
            { label: t("stats.contract_address"), value: CONTRACT_ADDRESS, link: `${BASESCAN_URL}/address/${CONTRACT_ADDRESS}` },
            { label: t("stats.chain"), value: t("stats.chain_value") },
            { label: t("stats.supply_cap"), value: capFormatted ? `${capFormatted} SATHU` : t("common.loading") },
            { label: t("stats.daily_limit_label"), value: maxDailyMintFormatted ? `${maxDailyMintFormatted} SATHU` : t("common.loading") },
          ].map((row, i) => (
            <div key={i} className="flex flex-col gap-0.5 border-b border-warm-200/60 pb-3 last:border-0 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-sm font-medium text-warm-800/50 sm:w-40 shrink-0">{row.label}</span>
              {row.link ? (
                <a
                  href={row.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-base-blue hover:text-base-blue-dark break-all transition-colors"
                >
                  {row.value}
                </a>
              ) : (
                <span className="text-sm font-medium text-warm-900">{row.value}</span>
              )}
            </div>
          ))}
        </div>
        <a
          href={`${BASESCAN_URL}/address/${CONTRACT_ADDRESS}#code`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-base-blue hover:text-base-blue-dark transition-colors"
        >
          {t("stats.verified_source")} →
        </a>
      </section>
    </div>
  );
}
