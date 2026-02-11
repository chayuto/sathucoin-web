import { useTranslation } from "react-i18next";

export default function DeedList({ deeds, loading }) {
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

  return (
    <div className="overflow-hidden rounded-2xl border border-warm-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-warm-100">
            <th className="px-4 py-3 font-semibold text-warm-800/70">{t("donors.deed_name")}</th>
            <th className="px-4 py-3 font-semibold text-warm-800/70">{t("donors.deed_amount")}</th>
            <th className="px-4 py-3 font-semibold text-warm-800/70">{t("donors.deed_date")}</th>
          </tr>
        </thead>
        <tbody>
          {deeds.map((deed, i) => (
            <tr
              key={i}
              className="border-t border-warm-200/60 bg-white/60 transition-colors hover:bg-sathu-gold-light/30"
            >
              <td className="px-4 py-3 text-warm-900">{deed.name}</td>
              <td className="px-4 py-3 font-medium text-warm-900">{deed.amount}</td>
              <td className="px-4 py-3 text-warm-800/60">{deed.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
