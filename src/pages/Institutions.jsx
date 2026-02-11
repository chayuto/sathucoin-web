import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CONTRACT_ADDRESS, BASESCAN_URL } from "../config";

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-warm-200/60 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-warm-900 hover:text-sathu-gold transition-colors"
      >
        {question}
        <span className={`ml-3 text-sathu-gold transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <p className="text-sm text-warm-800/70 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Institutions() {
  const { t } = useTranslation();
  const mascotSrc = `${import.meta.env.BASE_URL}assets/sathu_mascot.png`;

  const steps = [
    { num: "1", text: t("institutions.how_step_1"), emoji: "📱" },
    { num: "2", text: t("institutions.how_step_2"), emoji: "📋" },
    { num: "3", text: t("institutions.how_step_3"), emoji: "🪙" },
    { num: "4", text: t("institutions.how_step_4"), emoji: "📝" },
  ];

  const faqs = [
    { q: t("institutions.faq_handle_q"), a: t("institutions.faq_handle_a") },
    { q: t("institutions.faq_donor_pay_q"), a: t("institutions.faq_donor_pay_a") },
    { q: t("institutions.faq_verify_q"), a: t("institutions.faq_verify_a") },
    { q: t("institutions.faq_wallet_q"), a: t("institutions.faq_wallet_a") },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-warm-900">{t("institutions.title")}</h1>
        <p className="mt-2 text-warm-800/60">{t("institutions.subtitle")}</p>
      </div>

      {/* What is SaThuCoin */}
      <section className="glass-card rounded-2xl p-6 animate-fade-in-up-delay-1">
        <h2 className="gold-underline mb-4 text-lg font-bold text-warm-900">{t("institutions.what_is_title")}</h2>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <img
            src={mascotSrc}
            alt={t("common.alt_mascot")}
            className="hidden h-28 w-28 shrink-0 object-contain animate-float sm:block"
            loading="lazy"
          />
          <div>
            <p className="text-sm text-warm-800/80 leading-relaxed">{t("institutions.what_is_p1")}</p>
            <p className="mt-3 text-sm text-warm-800/80 leading-relaxed">{t("institutions.what_is_p2")}</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="animate-fade-in-up-delay-2">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("institutions.how_it_works_title")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step) => (
            <div key={step.num} className="glass-card rounded-2xl p-5 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-base-blue text-lg font-bold text-white shadow-sm">
                {step.emoji}
              </div>
              <div>
                <span className="text-xs font-bold text-base-blue uppercase tracking-wider">
                  {t("institutions.how_it_works_title")} {step.num}
                </span>
                <p className="mt-1 text-sm text-warm-800/80 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What to Collect */}
      <section className="glass-card rounded-2xl p-6">
        <h2 className="gold-underline mb-4 text-lg font-bold text-warm-900">{t("institutions.collect_title")}</h2>
        <p className="text-sm text-warm-800/80 leading-relaxed">{t("institutions.collect_desc")}</p>
        <div className="mt-4 rounded-xl bg-warm-100 p-4 border border-warm-200/60">
          <p className="text-xs font-semibold text-warm-800/50 uppercase tracking-wider">{t("institutions.collect_example")}</p>
          <code className="mt-2 block text-sm text-warm-900 break-all font-mono">
            0xEeB5c90edaA4a029752273644D40801E83329268
          </code>
        </div>
        <p className="mt-4 text-sm italic text-warm-800/60">{t("institutions.collect_prompt")}</p>
      </section>

      {/* Integration Info */}
      <section className="glass-card rounded-2xl p-6">
        <h2 className="gold-underline mb-4 text-lg font-bold text-warm-900">{t("institutions.integration_title")}</h2>
        <div className="space-y-3">
          <div className="flex flex-col gap-0.5 border-b border-warm-200/60 pb-3 sm:flex-row sm:gap-4">
            <span className="text-sm font-medium text-warm-800/50 sm:w-36 shrink-0">{t("institutions.integration_contract")}</span>
            <a
              href={`${BASESCAN_URL}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-base-blue hover:text-base-blue-dark break-all transition-colors"
            >
              {CONTRACT_ADDRESS}
            </a>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <span className="text-sm font-medium text-warm-800/50 sm:w-36 shrink-0">{t("institutions.integration_chain")}</span>
            <span className="text-sm font-medium text-warm-900">{t("institutions.integration_chain_value")}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-warm-800/60">{t("institutions.integration_verify")}</p>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("institutions.faq_title")}</h2>
        <div className="glass-card rounded-2xl px-6">
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}
