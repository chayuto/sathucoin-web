import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTokenStats } from "../hooks/useTokenStats";
import StatsCard from "../components/StatsCard";
import SupplyProgress from "../components/SupplyProgress";
import ContractStatus from "../components/ContractStatus";

const cards = [
  { to: "/donors", titleKey: "home.card_donors_title", descKey: "home.card_donors_desc" },
  { to: "/institutions", titleKey: "home.card_institutions_title", descKey: "home.card_institutions_desc" },
  { to: "/stats", titleKey: "home.card_stats_title", descKey: "home.card_stats_desc" },
];

export default function Home() {
  const { t } = useTranslation();
  const { totalSupply, totalSupplyFormatted, cap, capFormatted, paused } = useTokenStats();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          {t("home.hero_tagline")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          {t("home.hero_description")}
        </p>
      </section>

      {/* Live Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label={t("home.total_supply")}
          value={totalSupplyFormatted ? `${totalSupplyFormatted} SATHU` : t("common.loading")}
        />
        <StatsCard
          label={t("home.supply_cap")}
          value={capFormatted ? `${capFormatted} SATHU` : t("common.loading")}
        />
        <StatsCard
          label={t("home.contract_status")}
          value={<ContractStatus paused={paused} />}
        />
      </section>

      <SupplyProgress totalSupply={totalSupply} cap={cap} />

      {/* Navigation Cards */}
      <section className="grid gap-6 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-base-blue">
              {t(card.titleKey)}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{t(card.descKey)}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
