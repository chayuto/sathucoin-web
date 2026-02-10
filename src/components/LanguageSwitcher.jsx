import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggle = () => {
    i18n.changeLanguage(currentLang === "th" ? "en" : "th");
  };

  return (
    <button
      onClick={toggle}
      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition-colors"
      aria-label="Switch language"
    >
      {currentLang === "th" ? "EN" : "TH"}
    </button>
  );
}
