import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { formatUnits } from "viem";
import { useTokenStats } from "../hooks/useTokenStats";
import StatsCard from "../components/StatsCard";
import SupplyProgress from "../components/SupplyProgress";
import ContractStatus from "../components/ContractStatus";
import { TOKEN_DECIMALS } from "../config";

export default function Home() {
  const { t } = useTranslation();
  const { totalSupply, totalSupplyFormatted, cap, capFormatted, paused } = useTokenStats();
  const bannerSrc = `${import.meta.env.BASE_URL}assets/sathu_banner.png`;
  const coinSrc = `${import.meta.env.BASE_URL}assets/sathu_coin.png`;

  const coinIcon = {
    src: coinSrc,
    alt: t("common.alt_token_icon"),
  };

  const navCards = [
    {
      to: "/donors",
      title: t("home.card_donors_title"),
      desc: t("home.card_donors_desc"),
      emoji: "🙏",
      gradient: "from-blue-500/10 to-sathu-gold/10",
    },
    {
      to: "/institutions",
      title: t("home.card_institutions_title"),
      desc: t("home.card_institutions_desc"),
      emoji: "🏛️",
      gradient: "from-sathu-gold/10 to-orange-500/10",
    },
    {
      to: "/stats",
      title: t("home.card_stats_title"),
      desc: t("home.card_stats_desc"),
      emoji: "📊",
      gradient: "from-green-500/10 to-blue-500/10",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="animate-fade-in-up relative overflow-hidden rounded-3xl shadow-xl">
        <img
          src={bannerSrc}
          alt={t("common.alt_banner")}
          className="h-72 w-full object-cover sm:h-80 lg:h-[28rem]"
          loading="eager"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-warm-900/70 via-warm-900/40 to-transparent px-4 text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl lg:text-5xl leading-snug">
            {t("home.hero_tagline")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 drop-shadow sm:text-lg leading-relaxed">
            {t("home.hero_description")}
          </p>
        </div>
      </section>

      {/* Live Stats */}
      <section className="animate-fade-in-up-delay-1">
        <h2 className="gold-underline mb-6 text-xl font-bold text-warm-900">
          {t("home.supply_progress")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            label={t("home.total_supply")}
            value={totalSupplyFormatted ? `${totalSupplyFormatted} SATHU` : t("common.loading")}
            icon={coinIcon}
          />
          <StatsCard
            label={t("home.supply_cap")}
            value={capFormatted ? `${capFormatted} SATHU` : t("common.loading")}
            icon={coinIcon}
          />
          <StatsCard
            label={t("home.contract_status")}
            value={<ContractStatus paused={paused} />}
          />
        </div>
      </section>

      {/* Supply Progress */}
      <section className="animate-fade-in-up-delay-2">
        <SupplyProgress
          totalSupply={totalSupply !== undefined ? Number(formatUnits(totalSupply, TOKEN_DECIMALS)) : undefined}
          cap={cap !== undefined ? Number(formatUnits(cap, TOKEN_DECIMALS)) : undefined}
        />
      </section>

      {/* Nav Cards */}
      <section className="animate-fade-in-up-delay-3">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {navCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={`group glass-card rounded-2xl p-6 bg-gradient-to-br ${card.gradient} hover:shadow-lg transition-all duration-300`}
            >
              <div className="mb-3 text-3xl">{card.emoji}</div>
              <h3 className="text-lg font-bold text-warm-900 group-hover:text-sathu-gold transition-colors">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-warm-800/60 leading-relaxed">
                {card.desc}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-base-blue group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
