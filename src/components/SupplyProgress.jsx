import { useTranslation } from "react-i18next";

export default function SupplyProgress({ totalSupply, cap }) {
  const { t } = useTranslation();

  if (totalSupply === undefined || cap === undefined) return null;

  const percentage = cap > 0 ? (Number(totalSupply) / Number(cap)) * 100 : 0;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-3 flex justify-between text-sm font-medium">
        <span className="text-warm-800/70">{t("home.supply_progress")}</span>
        <span className="text-sathu-gold font-semibold">{percentage.toFixed(4)}%</span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full bg-warm-200">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.max(Math.min(percentage, 100), 1)}%`,
            background: "linear-gradient(90deg, #0052FF 0%, #F5A623 100%)",
            boxShadow: "0 0 12px rgba(245, 166, 35, 0.4)",
          }}
        />
      </div>
    </div>
  );
}
