import { useTranslation } from "react-i18next";

export default function ContractStatus({ paused }) {
  const { t } = useTranslation();

  if (paused === undefined) return null;

  return paused ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
      <span className="h-2 w-2 rounded-full bg-red-500" />
      {t("common.paused")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      {t("common.active")}
    </span>
  );
}
