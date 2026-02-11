import { useTranslation } from "react-i18next";
import { BASESCAN_URL, CONTRACT_ADDRESS, GITHUB_URL } from "../config";

export default function About() {
  const { t } = useTranslation();
  const mascotSrc = `${import.meta.env.BASE_URL}assets/sathu_mascot.png`;

  const steps = [
    { num: "1", text: t("about.how_step_1"), emoji: "🙏" },
    { num: "2", text: t("about.how_step_2"), emoji: "✅" },
    { num: "3", text: t("about.how_step_3"), emoji: "🪙" },
    { num: "4", text: t("about.how_step_4"), emoji: "⛓️" },
  ];

  const resources = [
    {
      label: t("about.basescan_link"),
      href: `${BASESCAN_URL}/address/${CONTRACT_ADDRESS}`,
      emoji: "🔍",
    },
    {
      label: t("about.github_link"),
      href: GITHUB_URL,
      emoji: "💻",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-warm-900">{t("about.title")}</h1>
      </div>

      {/* Mission */}
      <section className="glass-card rounded-2xl p-6 animate-fade-in-up-delay-1">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("about.mission_title")}</h2>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <img
            src={mascotSrc}
            alt={t("common.alt_mascot")}
            className="hidden h-36 w-36 shrink-0 object-contain animate-float sm:block"
            loading="lazy"
          />
          <div>
            <p className="text-sm text-warm-800/80 leading-relaxed">{t("about.mission_p1")}</p>
            <p className="mt-3 text-sm text-warm-800/80 leading-relaxed">{t("about.mission_p2")}</p>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="animate-fade-in-up-delay-2">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("about.how_it_works_title")}</h2>
        <div className="relative space-y-0">
          {steps.map((step, i) => (
            <div key={step.num} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-10 h-full w-0.5 bg-gradient-to-b from-base-blue/30 to-sathu-gold/30" />
              )}
              {/* Step circle */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md border-2 border-sathu-gold/30 text-lg">
                {step.emoji}
              </div>
              {/* Content */}
              <div className="glass-card rounded-xl p-4 flex-1">
                <span className="text-xs font-bold text-sathu-gold uppercase tracking-wider">ขั้นตอนที่ {step.num}</span>
                <p className="mt-1 text-sm text-warm-800/80 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="animate-fade-in-up-delay-3">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("about.resources_title")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((res, i) => (
            <a
              key={i}
              href={res.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card group flex items-center gap-4 rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
            >
              <span className="text-2xl">{res.emoji}</span>
              <span className="text-sm font-semibold text-warm-900 group-hover:text-base-blue transition-colors">
                {res.label}
              </span>
              <span className="ml-auto text-sm text-warm-800/40 group-hover:text-base-blue group-hover:translate-x-1 transition-all">
                →
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
