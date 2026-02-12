import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { formatTokenAmount } from "../utils/formatAmount";
import { BASESCAN_URL } from "../config";

const DEED_TEXT_LIMIT = 80;

function DeedCard({ deed }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const { value, unit } = formatTokenAmount(deed.amount);
  const unitLabel = unit === "boon" ? t("donors.deed_boon_unit") : unit;
  const isLong = deed.deed && deed.deed.length > DEED_TEXT_LIMIT;
  const displayText =
    isLong && !expanded
      ? deed.deed.slice(0, DEED_TEXT_LIMIT) + "…"
      : deed.deed;

  const txUrl = deed.transactionHash
    ? `${BASESCAN_URL}/tx/${deed.transactionHash}`
    : null;

  return (
    <div className="glass-card rounded-xl p-4 space-y-2 animate-fade-in-up">
      {/* Deed text */}
      <p className="text-warm-900 text-sm leading-relaxed break-words">
        {displayText || "—"}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-base-blue hover:text-base-blue-dark transition-colors"
        >
          {expanded ? t("donors.deed_collapse") : t("donors.deed_expand")}
        </button>
      )}

      {/* Amount + meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="font-semibold text-sathu-gold">
          {value} {unitLabel}
        </span>
        <span className="text-warm-800/50">
          Block #{deed.blockNumber?.toString()}
        </span>
        {txUrl && (
          <a
            href={txUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-base-blue hover:text-base-blue-dark transition-colors"
          >
            {t("donors.deed_view_tx")}
            <HiOutlineArrowTopRightOnSquare className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function DeedList({ deeds, loading, limit = 10 }) {
  const { t } = useTranslation();
  const mascotSrc = `${import.meta.env.BASE_URL}assets/sathu_mascot.png`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 rounded-full border-3 border-sathu-gold/30 border-t-sathu-gold animate-spin" />
      </div>
    );
  }

  if (!deeds || deeds.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center animate-fade-in-up">
        <img
          src={mascotSrc}
          alt={t("common.alt_mascot")}
          className="mb-4 h-28 w-28 object-contain animate-float"
          loading="lazy"
        />
        <p className="text-warm-800/50 text-sm">{t("donors.no_deeds")}</p>
      </div>
    );
  }

  const displayed = deeds.slice(0, limit);

  return (
    <div className="space-y-3">
      {displayed.map((deed, i) => (
        <DeedCard key={deed.transactionHash || i} deed={deed} />
      ))}
    </div>
  );
}
