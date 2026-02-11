import { useTranslation } from "react-i18next";
import { formatUnits } from "viem";
import BalanceChecker from "../components/BalanceChecker";
import DeedList from "../components/DeedList";
import { useDeedEvents } from "../hooks/useDeedEvents";
import { useAddToMetaMask } from "../hooks/useAddToMetaMask";
import { TOKEN_DECIMALS } from "../config";
import { useState } from "react";

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

export default function Donors() {
  const { t } = useTranslation();
  const { deeds: recentDeeds, isLoading: deedsLoading } = useDeedEvents();
  const { addToken, isAvailable: metamaskAvailable } = useAddToMetaMask();
  const mascotSrc = `${import.meta.env.BASE_URL}assets/sathu_mascot.png`;
  const coinSrc = `${import.meta.env.BASE_URL}assets/sathu_coin.png`;

  const walletSteps = [
    { num: "1", text: t("donors.wallet_step_1") },
    { num: "2", text: t("donors.wallet_step_2") },
    { num: "3", text: t("donors.wallet_step_3") },
    { num: "4", text: t("donors.wallet_step_4") },
    { num: "5", text: t("donors.wallet_step_5") },
  ];

  const faqs = [
    { q: t("donors.faq_cost_q"), a: t("donors.faq_cost_a") },
    { q: t("donors.faq_use_q"), a: t("donors.faq_use_a") },
    { q: t("donors.faq_network_q"), a: t("donors.faq_network_a") },
    { q: t("donors.faq_address_q"), a: t("donors.faq_address_a") },
    { q: t("donors.faq_missing_q"), a: t("donors.faq_missing_a") },
  ];

  const deedTableRows = recentDeeds?.map((d) => ({
    name: d.deed,
    amount: `${Number(formatUnits(d.amount, TOKEN_DECIMALS)).toLocaleString()} SATHU`,
    date: `Block #${d.blockNumber?.toString()}`,
  }));

  const handleAddToken = () => {
    if (!metamaskAvailable) {
      alert(t("donors.metamask_not_installed"));
      return;
    }
    addToken();
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-warm-900">{t("donors.title")}</h1>
        <p className="mt-2 text-warm-800/60">{t("donors.subtitle")}</p>
      </div>

      {/* Balance Checker */}
      <section className="glass-card rounded-2xl p-6 animate-fade-in-up-delay-1">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("donors.balance_section")}</h2>
        <BalanceChecker />
      </section>

      {/* Deed History */}
      <section className="animate-fade-in-up-delay-2">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("donors.deed_history")}</h2>
        <DeedList deeds={deedTableRows} loading={deedsLoading} />
      </section>

      {/* Wallet Setup Guide */}
      <section className="glass-card rounded-2xl p-6">
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("donors.wallet_setup_title")}</h2>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <img
            src={mascotSrc}
            alt={t("common.alt_mascot")}
            className="hidden h-36 w-36 shrink-0 object-contain animate-float sm:block"
            loading="lazy"
          />
          <div className="flex-1 space-y-3">
            {walletSteps.map((step) => (
              <div key={step.num} className="flex items-start gap-3 group">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-base-blue text-xs font-bold text-white shadow-sm">
                  {step.num}
                </span>
                <p className="text-sm text-warm-800/80 pt-0.5 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add to MetaMask */}
      <section className="glass-card rounded-2xl p-6">
        <div className="mb-3 flex items-center gap-2.5">
          <img src={coinSrc} alt={t("common.alt_token_icon")} className="h-7 w-7 object-contain" loading="lazy" />
          <h2 className="text-lg font-bold text-warm-900">{t("donors.add_metamask_title")}</h2>
        </div>
        <p className="text-sm text-warm-800/60 mb-4">{t("donors.add_metamask_desc")}</p>
        <button
          onClick={handleAddToken}
          className="rounded-xl bg-sathu-gold px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-sathu-gold-dark hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          {t("donors.add_metamask_button")}
        </button>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="gold-underline mb-5 text-lg font-bold text-warm-900">{t("donors.faq_title")}</h2>
        <div className="glass-card rounded-2xl px-6">
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}
