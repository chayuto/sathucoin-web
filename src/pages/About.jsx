import { useTranslation } from "react-i18next";
import { CONTRACT_ADDRESS, BASESCAN_URL, GITHUB_URL } from "../config";

const mascotSrc = `${import.meta.env.BASE_URL}assets/sathu_mascot.png`;

export default function About() {
  const { t } = useTranslation();

  const steps = [
    t("about.how_step_1"),
    t("about.how_step_2"),
    t("about.how_step_3"),
    t("about.how_step_4"),
  ];

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-gray-900">{t("about.title")}</h1>

      {/* Mission */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("about.mission_title")}</h2>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <img
            src={mascotSrc}
            alt={t("common.alt_mascot")}
            className="hidden h-36 w-36 shrink-0 object-contain sm:block"
            loading="lazy"
          />
          <div>
            <p className="text-gray-700">{t("about.mission_p1")}</p>
            <p className="mt-2 text-gray-700">{t("about.mission_p2")}</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("about.how_it_works_title")}</h2>
        <ol className="list-inside list-decimal space-y-2 text-gray-700">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Resources */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("about.resources_title")}</h2>
        <div className="flex flex-col gap-3">
          <a
            href={`${BASESCAN_URL}/address/${CONTRACT_ADDRESS}#code`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-blue hover:underline"
          >
            {t("about.basescan_link")}
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-blue hover:underline"
          >
            {t("about.github_link")}
          </a>
        </div>
      </section>
    </div>
  );
}
