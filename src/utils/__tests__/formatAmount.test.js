import { describe, it, expect } from "vitest";
import { formatTokenAmount } from "../formatAmount";

describe("formatTokenAmount", () => {
  it("returns '0 SATHU' for null/undefined", () => {
    expect(formatTokenAmount(null)).toEqual({ value: "0", unit: "SATHU" });
    expect(formatTokenAmount(undefined)).toEqual({ value: "0", unit: "SATHU" });
  });

  it("returns boon for amounts less than 1 SATHU", () => {
    expect(formatTokenAmount(1n)).toEqual({ value: "1", unit: "boon" });
    expect(formatTokenAmount(500n)).toEqual({ value: "500", unit: "boon" });
    expect(formatTokenAmount(999999999999999999n)).toEqual({
      value: "999999999999999999",
      unit: "boon",
    });
  });

  it("returns SATHU for amounts >= 1 SATHU", () => {
    const oneSATHU = 10n ** 18n;
    const result = formatTokenAmount(oneSATHU);
    expect(result.value).toBe("1");
    expect(result.unit).toBe("SATHU");
  });

  it("formats amounts with decimals", () => {
    // 1.5 SATHU
    const amount = 1500000000000000000n;
    const result = formatTokenAmount(amount);
    expect(result.value).toBe("1.5");
    expect(result.unit).toBe("SATHU");
  });

  it("formats large amounts with thousands separators", () => {
    // 1000 SATHU
    const amount = 1000n * 10n ** 18n;
    const result = formatTokenAmount(amount);
    expect(result.value).toBe("1,000");
    expect(result.unit).toBe("SATHU");
  });

  it("handles the boundary exactly at 1 SATHU", () => {
    const justBelow = 10n ** 18n - 1n;
    const exactly = 10n ** 18n;

    expect(formatTokenAmount(justBelow).unit).toBe("boon");
    expect(formatTokenAmount(exactly).unit).toBe("SATHU");
  });

  it("handles zero", () => {
    expect(formatTokenAmount(0n)).toEqual({ value: "0", unit: "boon" });
  });
});
