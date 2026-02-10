import { useTranslation } from "react-i18next";
import { useAddToMetaMask } from "../hooks/useAddToMetaMask";

export default function AddToMetaMask() {
  const { t } = useTranslation();
  const { addToken, isAvailable } = useAddToMetaMask();

  if (!isAvailable) return null;

  return (
    <button
      onClick={addToken}
      className="rounded-lg bg-sathu-gold px-4 py-2 font-medium text-white hover:bg-sathu-gold/90 transition-colors"
    >
      {t("donors.add_metamask_button")}
    </button>
  );
}
