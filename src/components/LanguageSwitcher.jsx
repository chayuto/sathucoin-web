import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "th";
  const isThai = currentLang === "th" || currentLang.startsWith("th-");

  const toggle = () => {
    i18n.changeLanguage(isThai ? "en" : "th");
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 rounded-full border border-sathu-gold/30 bg-sathu-gold-light px-3 py-1.5 text-sm font-medium text-sathu-gold-dark hover:bg-sathu-gold/10 transition-all duration-200"
      aria-label="Switch language"
    >
      <span className="text-base leading-none">{isThai ? "🇬🇧" : "🇹🇭"}</span>
      <span>{isThai ? "EN" : "TH"}</span>
    </button>
  );
}
