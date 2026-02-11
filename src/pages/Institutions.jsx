import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CONTRACT_ADDRESS, BASESCAN_URL } from "../config";

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

export default function Institutions() {
  const { t } = useTranslation();

  const steps = [
    t("institutions.how_step_1"),
    t("institutions.how_step_2"),
    t("institutions.how_step_3"),
    t("institutions.how_step_4"),
  ];

  const faqs = [
    { q: t("institutions.faq_handle_q"), a: t("institutions.faq_handle_a") },
    { q: t("institutions.faq_donor_pay_q"), a: t("institutions.faq_donor_pay_a") },
    { q: t("institutions.faq_verify_q"), a: t("institutions.faq_verify_a") },
    { q: t("institutions.faq_wallet_q"), a: t("institutions.faq_wallet_a") },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("institutions.title")}</h1>
        <p className="mt-2 text-gray-600">{t("institutions.subtitle")}</p>
      </div>

      {/* What is SaThuCoin */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("institutions.what_is_title")}</h2>
        <p className="text-gray-700">{t("institutions.what_is_p1")}</p>
        <p className="mt-2 text-gray-700">{t("institutions.what_is_p2")}</p>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("institutions.how_it_works_title")}</h2>
        <ol className="list-inside list-decimal space-y-2 text-gray-700">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      {/* What to Collect */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("institutions.collect_title")}</h2>
        <p className="text-gray-700">{t("institutions.collect_desc")}</p>
        <div className="mt-3 rounded-lg bg-gray-100 p-4">
          <p className="text-sm font-medium text-gray-500">{t("institutions.collect_example")}</p>
          <code className="mt-1 block text-sm text-gray-800 break-all">
            0xEeB5c90edaA4a029752273644D40801E83329268
          </code>
        </div>
        <p className="mt-3 text-sm italic text-gray-600">{t("institutions.collect_prompt")}</p>
      </section>

      {/* Integration Info */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("institutions.integration_title")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 pr-4 font-medium text-gray-500">{t("institutions.integration_contract")}</td>
                <td className="py-3">
                  <a
                    href={`${BASESCAN_URL}/address/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-blue hover:underline break-all"
                  >
                    {CONTRACT_ADDRESS}
                  </a>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 pr-4 font-medium text-gray-500">{t("institutions.integration_chain")}</td>
                <td className="py-3 text-gray-700">{t("institutions.integration_chain_value")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-600">{t("institutions.integration_verify")}</p>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("institutions.faq_title")}</h2>
        <div className="rounded-xl border border-gray-200 bg-white px-6">
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}
