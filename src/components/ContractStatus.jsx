import { useTranslation } from "react-i18next";

export default function ContractStatus({ paused }) {
  const { t } = useTranslation();

  if (paused === undefined) return null;

  return paused ? (
    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600 shadow-sm">
      <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse-dot" />
      {t("common.paused")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-600 shadow-sm">
      <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse-dot" />
      {t("common.active")}
    </span>
  );
}
