import { formatUnits } from "viem";
import { TOKEN_DECIMALS } from "../config";

const ONE_TOKEN = 10n ** BigInt(TOKEN_DECIMALS);

/**
 * Format a raw token amount (BigInt) into a human-readable value + unit.
 * - Amounts < 1 SATHU are shown in boon (1 boon = 10⁻¹⁸ SATHU).
 * - Amounts >= 1 SATHU are shown with up to 2 decimal places,
 *   with thousands separators for large numbers.
 */
export function formatTokenAmount(amount) {
  if (amount == null) return { value: "0", unit: "SATHU" };

  const raw = BigInt(amount);

  if (raw < ONE_TOKEN) {
    return { value: raw.toString(), unit: "boon" };
  }

  const formatted = formatUnits(raw, TOKEN_DECIMALS);
  const num = Number(formatted);

  // Use compact notation for very large numbers (1M+)
  if (num >= 1_000_000) {
    return {
      value: num.toLocaleString("en-US", { maximumFractionDigits: 0 }),
      unit: "SATHU",
    };
  }

  // For normal amounts, show up to 2 decimals with thousands separators
  return {
    value: num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    unit: "SATHU",
  };
}
