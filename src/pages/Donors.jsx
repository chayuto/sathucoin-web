import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import BalanceChecker from "../components/BalanceChecker";
import DeedList from "../components/DeedList";
import AddToMetaMask from "../components/AddToMetaMask";

const coinIconSrc = `${import.meta.env.BASE_URL}assets/sathu_coin.png`;
const mascotSrc = `${import.meta.env.BASE_URL}assets/sathu_mascot.png`;

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900"
      >
        {question}
        <span className="ml-2 text-gray-400">{open ? "\u2212" : "+"}</span>
      </button>
      {open && <p className="pb-4 text-sm text-gray-600">{answer}</p>}
    </div>
  );
}

export default function Donors() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();

  const faqs = [
    { q: t("donors.faq_cost_q"), a: t("donors.faq_cost_a") },
    { q: t("donors.faq_use_q"), a: t("donors.faq_use_a") },
    { q: t("donors.faq_network_q"), a: t("donors.faq_network_a") },
    { q: t("donors.faq_address_q"), a: t("donors.faq_address_a") },
    { q: t("donors.faq_missing_q"), a: t("donors.faq_missing_a") },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("donors.title")}</h1>
        <p className="mt-2 text-gray-600">{t("donors.subtitle")}</p>
      </div>

      {/* Balance Checker */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("donors.balance_section")}</h2>
        <BalanceChecker />
      </section>

      {/* Deed History */}
      {isConnected && address && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("donors.deed_history")}</h2>
          <DeedList address={address} />
        </section>
      )}

      {/* Wallet Setup Guide */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("donors.wallet_setup_title")}</h2>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <img
            src={mascotSrc}
            alt={t("common.alt_mascot")}
            className="hidden h-32 w-32 shrink-0 object-contain sm:block"
            loading="lazy"
          />
          <ol className="list-inside list-decimal space-y-2 text-gray-700">
            <li>{t("donors.wallet_step_1")}</li>
            <li>{t("donors.wallet_step_2")}</li>
            <li>{t("donors.wallet_step_3")}</li>
            <li>{t("donors.wallet_step_4")}</li>
            <li>{t("donors.wallet_step_5")}</li>
          </ol>
        </div>
      </section>

      {/* Add to MetaMask */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <img
            src={coinIconSrc}
            alt={t("common.alt_token_icon")}
            className="h-6 w-6 object-contain"
            loading="lazy"
          />
          <h2 className="text-xl font-semibold text-gray-900">{t("donors.add_metamask_title")}</h2>
        </div>
        <p className="mb-4 text-sm text-gray-600">{t("donors.add_metamask_desc")}</p>
        <AddToMetaMask />
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("donors.faq_title")}</h2>
        <div className="rounded-xl border border-gray-200 bg-white px-6">
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}
