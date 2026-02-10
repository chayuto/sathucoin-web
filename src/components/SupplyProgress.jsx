import { useTranslation } from "react-i18next";

export default function SupplyProgress({ totalSupply, cap }) {
  const { t } = useTranslation();

  if (totalSupply === undefined || cap === undefined) return null;

  const percentage = cap > 0 ? (Number(totalSupply) / Number(cap)) * 100 : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm text-gray-600">
        <span>{t("home.supply_progress")}</span>
        <span>{percentage.toFixed(4)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-base-blue transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
